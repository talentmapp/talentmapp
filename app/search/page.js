/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";
import MessageForm from "../components/ai_search/MessageForm";
import MessagesList from "../components/ai_search/MessagesList";
import Link from "next/link";

import { useUser } from "@auth0/nextjs-auth0/client";
import { signOut } from "@auth0/nextjs-auth0";

// JYWZGHJX87Z7VK7N49359JAQ

export default function Home() {
  const { user, error, isLoading } = useUser();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

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

  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirect to the home page after logout
  };

  const toggleLogout = () => {
    setShowLogout((prevShowLogout) => !prevShowLogout);
  };

  const closeLogout = () => {
    setShowLogout(false);
  };

  return (
    <div className="flex flex-col h-screen bg-black font-jakarta overscroll-none">
      <div className="lg:hidden flex flex-col h-full items-center justify-center overflow-hidden mb-12">
        <span className="text-white text-center">
          please open this site on a{" "}
          <span className="text-purple-400">bigger screen</span>
        </span>
        <div className="flex items-center justify-center">
          <img src="tm-small-logo.png" alt="logo" className="w-[20%]" />
          <span className="font-bold text-sm w-[30%] my-6 py-3 border-[#dfdede] border-[1px] hover:bg-purple-950 transition-all hover:scale-105 text-[#dfdede] inline-flex justify-center items-center rounded-lg">
            <a href="/">
              back to landing
            </a>
          </span>
        </div>
      </div>
      <div className="hidden lg:flex justify-between items-center w-[90%] py-6 ">
        <Link href="/">
          <img
            src="/tm-small-logo.png"
            alt="logo"
            className="w-[12%] xl:w-[7%] ml-20"
          />
        </Link>
        <span className="font-bold w-[50%] xl:max-w-[10%] py-3 mx-3 hover:text-purple-200 transition-all hover:scale-105 text-[#dfdede] inline-flex justify-center items-center rounded-lg">
          <a href="/about">learn more.</a>
        </span>
        <span className="font-bold w-[50%] xl:max-w-[10%] py-3 border-[#dfdede] border-opacity-70 hover:bg-purple-950 transition-all hover:scale-105 text-[#dfdede] inline-flex justify-center items-center rounded-lg">
          <a
            href="https://jgg07b9ji7m.typeform.com/to/nWBQtOpn"
            target="_blank"
            rel="noopener noreferrer"
          >
            join waitlist
          </a>
        </span>
        {!loading && user ? (
          <div className="relative" onBlur={closeLogout}>
            <img
              src={user.picture}
              alt="Profile"
              className="rounded-full w-12 h-12 mx-5 cursor-pointer"
              onClick={toggleLogout}
              tabIndex="0" // Make the profile image focusable
            />
            {showLogout && (
              <div className="absolute bottom-[-50px] bg-gray-900 text-white rounded-md py-1 px-3 shadow-md">
                <a href="/api/auth/signout">Logout</a>
              </div>
            )}
          </div>
        ) : (
          <span className="font-bold w-[50%] xl:max-w-[10%] py-3 mx-3 hover:text-purple-200 transition-all hover:scale-105 text-[#dfdede] inline-flex justify-center items-center rounded-lg">
            <a href="/api/auth/signin">login</a>
          </span>
        )}
      </div>
      <div className="hidden bg-black lg:block flex-grow px-20 pb-28">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <img src="ai_search/searching.gif" alt="Searching..." className="w-[30%]" />
          </div>
        ) : (
          <MessagesList messages={messages} />
        )}
      </div>
      <div
        ref={messagesEndRef}
        className="hidden fixed bottom-0 lg:block w-full"
      >
        <MessageForm onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
