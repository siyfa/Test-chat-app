import io from "socket.io-client";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

function Chat1() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [chat, setChat] = useState({});
  const [messages, setMessages] = useState([]);
  const [arrivalMsg, setArrivalMsg] = useState([])

  const socket = useRef(io.connect("http://localhost:7500"));
  const userId = 'customer1059152b4365c8695b217'

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXVpZCI6ImN1c3RvbWVyMTA1OTE1MmI0MzY1Yzg2OTViMjE3IiwiZW1haWwiOiJjdXN0b21lcnVzZXIxQGdtYWlsLmNvbSIsInJvbGUiOiJjdXN0b21lciIsInVzZXJUeXBlIjoidGVuYW50IiwiaWF0IjoxNjkyMDA1Mjg0LCJleHAiOjE3MDQxMDEyODR9.QqnfTlUu0sh4bv7oXK3zZ4CgHKCqQC9NzuQo7GUNjCw";

  useEffect(() => {
    socket.current = io.connect('http://localhost:7500');
    socket.current.on('getMessage', (data) => {
      console.log("data", data)
      setArrivalMsg({
        sender: data.sender,
        text: data.text,
        createdAt: Date.now()
      })
    })
  }, [])

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7500/api/v1/messaging/chat/rider142851b27e50bd3d1379d`,
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

  useEffect(() => {
    arrivalMsg && chat.members?.includes(arrivalMsg.sender) &&
      setMessages((prev) => [...prev, arrivalMsg])
  }, [arrivalMsg])

  useEffect(() => {
    socket.current.emit("addUser", userId)
    socket.current.on("getUsers", (users) => {
      console.log("online users", users)
    })
  }, [userId])

  // useEffect(() => {
  //   const chatHistory = async () => {
  //     const res = await axios.get(
  //       `http://localhost:7500/api/v1/messagings/${userId}`,
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

    const receiver = chat?.members.find((member) => member !== userId)

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
      `http://localhost:7500/api/v1/messaging/chat/${id}/${userId}`,
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
        {/* <div>
          {history.map((h, i) => (
            <div className="msg" key={i}>
              <p> {h.firstName + " " + h.lastName} </p>{" "}
              <span> {h.lastMsg} </span>{" "}
              <button onClick={(e) => getChat(h.id)}> chat </button>{" "}
            </div>
          ))}
        </div> */}
      </div>
      <div>
        {" "}
        {messages.map((m, i) => (
          <p key={i}> {m.text} </p>
        ))}{" "}
      </div>
      <div>
        <ul id="messages"> </ul>
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
