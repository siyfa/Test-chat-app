import io from "socket.io-client";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

function Chat2() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [chat, setChat] = useState({});
  const [arrivalMsg, setArrivalMsg] = useState([])
  const [messages, setMessages] = useState([])

  const socket = useRef(io.connect("http://localhost:7500"));
  const userId = 'rider142851b27e50bd3d1379d'

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXVpZCI6InJpZGVyMTQyODUxYjI3ZTUwYmQzZDEzNzlkIiwiZW1haWwiOiJyaWRlcnVzZXIxQGdtYWlsLmNvbSIsInJvbGUiOiJyaWRlciIsInVzZXJUeXBlIjoidGVuYW50IiwiaWF0IjoxNjkyMDA1NDg3LCJleHAiOjE3MDQxMDE0ODd9.zvS92TWgzXBCcNXyVG10S9OuSMJZGr_TClNRi6RKgnA"

  useEffect(() => {
    socket.current = io.connect('http://localhost:7500');
    socket.current.on('getMessage', (data) => {
      console.log("data", data)
      setArrivalMsg({
        sender: data.sender,
        text: data.text,
        createdAt: new Date
      })
    })
  }, [])

  useEffect(() => {
    arrivalMsg && chat.members?.includes(arrivalMsg.sender) &&
      setMessages((prev) => [...prev, arrivalMsg])
  }, [arrivalMsg])

  useEffect(() => {
    socket.current.emit("addUser", userId)
    socket.current.on("getUsers", (users) => {
      console.log("users", users)
    })
  }, [userId])

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7500/api/v1/messaging/chat/customer1059152b4365c8695b217`,
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
        const resp = res.data.data.chatFound;
        setMessages(JSON.parse(resp.chat.messages))
        setChat(resp.chat)
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    getMessages();
  }, []);

  // useEffect(() => {
  //   const chatHistory = async () => {
  //     const res = await axios.get(
  //       `http://localhost:7500/api/chats/${userId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setHistory(res.data);
  //   };
  //   chatHistory();
  // }, []);

  const formHandler = async (e) => {
    e.preventDefault();
    const newMsg = {
      sender: userId,
      text: input,
    };

    const receiver= chat?.members.find((member) => member !== userId)

    socket.current.emit('sendMessage', {
      sender: userId,
      receiver,
      text: input
    })

    const res = await axios.post(
      `http://localhost:7500/api/v1/messaging/send/1`,
      newMsg,
      {
        headers: {
          'x-auth-token': token,
        },
      }
    );
    setMessages([...messages, res.data.data.newMessage]);
    setInput("");
  };

  const getChat = async (id) => {
    const res = await axios.get(
      `http://localhost:7500/api/chat/messages/${id}/${userId}`,
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
      <h1> User Two </h1>{" "}
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

export default Chat2;
