import React, { FC, useState } from "react";
import "./Chat.css";

interface Message {
  id: number;
  text: string;
}

const Chat = () => {
  const [messages, setMessage] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const handleInput = () => {
    setMessage((prevMessages) => [
      ...prevMessages,
      { id: Date.now(), text: input },
    ]);
    setInput("");
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
      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type Your Message Here"
          className="chat-input"
        />
        <button onClick={handleInput} className="chat-button">
          Send
        </button>
      </div>

    </div>
  );
};
export default Chat;
