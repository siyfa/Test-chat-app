import io from "socket.io-client";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

function Chat1() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [chat, setChat] = useState([]);
  const [messages, setMessages] = useState([]);
  const [arrivalMsg, setArrivalMsg] = useState([])

  
  const socket = useRef(io.connect("https://localhost:8000"));
  const userId = '61b9d556623081424535539c'

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWI5ZDU1NjYyMzA4MTQyNDUzNTUzOWMiLCJpYXQiOjE2NDEyODg1Mzh9.iXriBIiGghK3lyIG2nu1Y1x47ZHF4nNUph72Kg_MT8w";
  
  useEffect(()=>{
    socket.current = io.connect('https://localhost:8000');
    socket.current.on('getMessage', (data)=>{
      console.log("data", data)
      setArrivalMsg({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now()
      })
    })
  },[])

  useEffect(()=>{
    arrivalMsg && chat.members?.includes(arrivalMsg.sender) &&
    setMessages((prev) => [...prev, arrivalMsg])
  },[arrivalMsg, chat?.members])
 
  useEffect(()=>{
    socket.current.emit("addUser", userId)
    socket.current.on("getUsers", (users)=>{
      console.log("online users", users)
    })
  },[userId])

  useEffect(() => {
    const chatHistory = async () => {
      const res = await axios.get(
        `https://localhost:8000/api/chats/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHistory(res.data);
    };
    chatHistory();
  }, []);

  const formHandler = async (e) => {
    e.preventDefault();
    const newMsg = {
      sender: userId,
      text: input,
    };

    const receiverId = chat?.members.find((member) => member !== userId)

    socket.current.emit('sendMessage', {
      senderId: userId,
      receiverId,
      text: input
    })

    const res = await axios.post(
      `https://localhost:8000/api/chat/new/message/61d30d5c82ea500340a87b3e/${userId}`,
      newMsg,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setMessages([...messages, res.data]);
    setInput("");
  };

  const getChat = async (id) => {
    const res = await axios.get(
      `https://localhost:8000/api/chat/messages/${id}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setChat(res.data);
    setMessages(res.data.messages)
  };

  return (
    <div className="chat">
      <h1> User one </h1>{" "}
      <div className="history">
        <h3> Chat History </h3>{" "}
        <div>
          {" "}
          {history.map((h, i) => (
            <div className="msg" key={i}>
              <p> {h.firstName + " " + h.lastName} </p>{" "}
              <span> {h.lastMsg} </span>{" "}
              <button onClick={(e) => getChat(h.id)}> chat </button>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>
      <div>
        {" "}
        {messages.map((m, i) => (
          <p key={i}> {m.text} </p>
        ))}{" "}
      </div>
      <div>
        <ul id="messages"> </ul>{" "}
        <form id="form" action="" onSubmit={formHandler}>
          <input
            id="input"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />{" "}
          <button type="submit"> Send </button>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
}

export default Chat1;
