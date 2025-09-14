import React, { useEffect, useMemo, useState } from "react";
import "./Chat.css";
import io from "socket.io-client";

interface Message {
  id: number;
  text: string;
}

const Chat = () => {
  const socket = useMemo(() => io("http://localhost:3001"), []);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("message", (data) => {
      setMessage((prev) => [...prev, { id: Date.now(), text: data }]);
    });

    return () => {
      setMessage([]);
      socket.disconnect();
    };
  }, []);

  const [messages, setMessage] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const sendMessage = (event: any) => {
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
