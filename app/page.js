"use client"
import { useState, useEffect, useRef } from "react";
import MessageForm from "./components/MessageForm";
import MessagesList from "./components/MessagesList";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Failed to search profiles or interact with OpenAI. Status: ${response.status}`);
      }

      const profiles = await response.json();
      // console.log(profiles);

      setMessages([
        ...messages,
        { sender: "user", text: message },
        { sender: "ai", profiles },
      ]);
    } catch (error) {
      console.error("Error details:", error);
      alert("An error occurred while searching for profiles. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black p-20">
      <div className="flex-grow">
        <MessagesList messages={messages} />
      </div>
      <div ref={messagesEndRef}>
        <MessageForm onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
