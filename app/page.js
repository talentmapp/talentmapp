/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";
import MessageForm from "./components/MessageForm";
import MessagesList from "./components/MessagesList";

// Color Palette

// Brand
// #5013AF

// White
// #F6F3FB

// Black
// #0C031A

// Border
// #D3CEDC

// Accente
// #845AC7

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    try {
      setLoading(true); // Set loading to true when sending a message

      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      setLoading(false); // Set loading to false after receiving response

      if (!response.ok) {
        throw new Error(
          `Failed to search profiles or interact with OpenAI. Status: ${response.status}`
        );
      }

      const profiles = await response.json();

      setMessages([
        ...messages,
        { sender: "user", text: message },
        { sender: "ai", profiles },
      ]);
    } catch (error) {
      setLoading(false); // Set loading to false if an error occurs
      console.error("Error details:", error);
      alert(
        "An error occurred while searching for profiles. Please try again later."
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black font-jakarta">
      <div className="flex justify-between items-center w-[90%] h-28">
        <img
          src="/tm-small-logo.png"
          alt="logo"
          className="w-[6%] ml-24"
        />
        <div className="">
          <span className="font-extrabold px-4 py-3 border-slate-400 border-2 bg-slate-600 text-[#dfdede] flex justify-center items-center rounded-lg"> 🚧 &nbsp; EARLY BUILD &nbsp; 🚧 </span>
        </div>
      </div>
      <div className="flex-grow  p-20">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <img src="/searching.gif" alt="Searching..." className="w-[30%]" />
          </div>
        ) : (
          <MessagesList messages={messages} />
        )}
      </div>
      <div
        ref={messagesEndRef}
        className="bg-gray-950 border-t-2 border-opacity-25 border-[#D3CEDC] pb-12 pt-8 w-full"
      >
        <MessageForm onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
