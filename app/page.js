"use client";
// app/pages/index.js
import Link from "next/link";

import { useState } from "react";
import MessageForm from "./components/MessageForm";
import MessagesList from "./components/MessagesList";
export default function Home() {
  const [messages, setMessages] = useState([]);

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
  
      // Assuming profiles is an array of objects with a 'name' property
      const profilesText = profiles.map(profile => profile.name).join(', ');
  
      setMessages([
        ...messages,
        { sender: "user", text: message },
        { sender: "ai", text: `Here are the matching profiles: ${profilesText}` },
      ]);
   } catch (error) {
      console.error("Error details:", error);
      // Provide a more descriptive error message to the user
      alert("An error occurred while searching for profiles. Please try again later.");
   }
  };
  

  return (
    <div className="p-20 bg-[#090f17] h-screen">
      <Link href="/api/auth/login">
          <span className="p-4 bg-indigo-600 text-white mr-8">Login</span>
      </Link>
      <Link href="/api/auth/logout">
          <span className="p-4 bg-red-600 text-white">Logout</span>
      </Link>
      <div className="mt-12">
        <MessagesList messages={messages} />
        <MessageForm onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

 