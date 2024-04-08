"use client";
// app/pages/index.js
import Link from "next/link";

// secret key: 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
import { useState } from "react";
import MessageForm from "./components/MessageForm";
import MessagesList from "./components/MessagesList";

import { getOpenAIResponse } from "../utils/openai";
import { searchProfiles } from './api/search/route';

export default function Home() {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (message) => {
    try {
       // Call the search API route to get the matching profiles
       const response = await fetch('/api/search', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ message }),
       });
   
       if (!response.ok) {
         throw new Error('Failed to search profiles or interact with OpenAI');
       }
   
       const profiles = await response.json();
   
       // Format the profiles for display
       const profilesText = profiles.map(profile => profile.name).join(', '); // Adjust based on your profile structure
   
       // Add the profiles to the messages state
       setMessages([
         ...messages,
         { sender: "user", text: message },
         { sender: "ai", text: `Here are the matching profiles: ${profilesText}` },
       ]);
    } catch (error) {
       console.error("Failed to get response from OpenAI or search profiles:", error);
       // Handle the error appropriately in your UI
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

  // const handleSendMessage = async (message) => {
  //   try {
  //      // Check if the message is a prompt for searching profiles
  //      if (message.toLowerCase().includes("search profiles")) {
  //        // Extract the prompt from the message
  //        const prompt = message.replace("search profiles", "").trim();
   
  //        // Call the searchProfiles function to get the matching profiles
  //        const profiles = await searchProfiles(prompt);
   
  //        // Format the profiles for display
  //        const profilesText = profiles.map(profile => profile.name).join(', '); // Adjust based on your profile structure
   
  //        // Add the profiles to the messages state
  //        setMessages([
  //          ...messages,
  //          { sender: "user", text: message },
  //          { sender: "ai", text: `Here are the matching profiles: ${profilesText}` },
  //        ]);
  //      } else {
  //        // Handle regular messages
  //        const aiResponse = await getOpenAIResponse(message);
  //        setMessages([
  //          ...messages,
  //          { sender: "user", text: message },
  //          { sender: "ai", text: aiResponse },
  //        ]);
  //      }
  //   } catch (error) {
  //      console.error("Failed to get response from OpenAI or search profiles:", error);
  //      // Handle the error appropriately in your UI
  //   }
  //  };
   

  // const handleSendMessage = async (message) => {
  //   try {
  //     // Check if the message is a prompt for searching profiles
  //     if (message.includes("search profiles")) {
  //       // Extract the prompt from the message
  //       const prompt = message.replace("search profiles", "").trim();
  
  //       // Call the searchProfiles function to get the matching profiles
  //       const profiles = await searchProfiles(prompt);
  
  //       // Add the profiles to the messages state
  //       setMessages([
  //         ...messages,
  //         { sender: "user", text: message },
  //         { sender: "ai", text: "Here are the matching profiles:", profiles },
  //       ]);
  //     } else {
  //       // Handle regular messages
  //       const aiResponse = await getOpenAIResponse(message);
  //       setMessages([
  //         ...messages,
  //         { sender: "user", text: message },
  //         { sender: "ai", text: aiResponse },
  //       ]);
  //     }
  //   } catch (error) {
  //     console.error("Failed to get response from OpenAI or search profiles:", error);
  //     // Handle the error appropriately in your UI
  //   }
  // };

