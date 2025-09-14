import React, { useEffect, useState } from "react";
import "./Chat.css";
import io, { Socket } from "socket.io-client";
import { useSocket } from "../../contexts/socketContext";

interface Message {
  id: number;
  text: string;
}


const Chat = () => {
  const socket = useSocket();
  const [messages, setMessage] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: string) => {
      setMessage((prev) => [...prev, { id: Date.now(), text: data }]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
      setInput("");
    };
  }, [socket]);


  const sendMessage = (event: any) => {
    if (!socket) return;

    socket.emit("message", input);
    setInput("");
    event.preventDefault();
  };

  return (
    <div className="chat-wrapper">
      <div className="messages">
        <ul>
          {messages.map((message) => (
            <li key={message.id} className="message">
              {message.text}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={sendMessage} className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type Your Message Here"
          className="chat-input"
        />
        <button disabled={!input.trim()} type="submit" className="chat-button">
          Send
        </button>
      </form>
    </div>
  );
};
export default Chat;
