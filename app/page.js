"use client";
import { useState, useEffect, useRef } from "react";
import MessageForm from "./components/ai_search/MessageForm";
import MessagesList from "./components/ai_search/MessagesList";
import { Button, Link } from "@nextui-org/react";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession(); // Get session data
  const user = session?.user; // Access user data

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

  const handleSendMessage = async (message, location, userId) => {
    try {
      setLoading(true);

      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, location, userId }),
      });

      setLoading(false);

      if (!response.ok) {
        throw new Error(
          `Failed to search profiles or interact with OpenAI. Status: ${response.status}`,
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
        "An error occurred while searching for profiles. Please try again later.",
      );
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/search" });
    window.location.reload();
  };

  const toggleLogout = () => {
    setShowLogout((prevShowLogout) => !prevShowLogout);
  };

  return (
    <div className="flex flex-col h-screen bg-black font-jakarta overscroll-none relative">
      {/* Navbar */}
      <div className="lg:hidden flex flex-col h-full items-center justify-center overflow-hidden mb-12">
        <span className="text-white text-center">
          please open this site on a{" "}
          <span className="text-purple-400">bigger screen</span>
        </span>
        <div className="flex items-center justify-center">
          <img src="tm-small-logo.png" alt="logo" className="w-[20%]" />
          <span className="font-bold text-sm w-[30%] my-6 py-3 border-[#dfdede] border-[1px] hover:bg-purple-950 transition-all hover:scale-105 text-[#dfdede] inline-flex justify-center items-center rounded-lg">
            <a href="/landing">back to landing</a>
          </span>
        </div>
      </div>

      <div className="hidden lg:flex justify-between items-center w-[90%] py-6 ">
        <div className="w-[100%]">
          <Link href="/" className="w-[12%] xl:w-[7%] ml-20">
            <img src="/tm-small-logo.png" alt="logo" className="" />
          </Link>
        </div>
        <span className="font-bold w-[50%] lg:max-w-[10%] py-3 mx-5  hover:text-purple-400 transition-all text-[#dfdede] inline-flex justify-center items-center rounded-lg">
          <a href="/about">learn more.</a>
        </span>
        {!loading && user ? (
          <div className="relative">
            <img
              src={user.image}
              alt="Profile"
              className="rounded-full w-14 border-dashed p-1 border-[1px] h-auto mx-5 cursor-pointer"
              onClick={toggleLogout}
              tabIndex="0" // Make the profile image focusable
            />
            {showLogout && (
              <ul className="absolute z-50 flex flex-col divide-y-1 divide-slate-700 border-[1px] border-slate-700 items-center justify-between bottom-[-90px] text-gray-500 rounded-sm shadow-md">
                <div className="group w-full z-60 py-2 px-4 flex justify-center rounded-t-sm transition bg-slate-800 hover:bg-slate-200">
                  <Link
                    href="/profile"
                    className="group-hover:font-semibold group-hover:text-slate-600 text-slate-300"
                  >
                    Profile
                  </Link>
                </div>
                <div className="group w-full z-60 py-2 px-4 flex justify-center rounded-t-sm transition bg-slate-800 hover:bg-slate-200">
                  <Link
                    href="/api/auth/signout"
                    className="group-hover:font-semibold group-hover:text-slate-600 text-slate-300"
                  >
                    Logout
                  </Link>
                </div>
              </ul>
            )}
          </div>
        ) : (
          <Link
            href="/api/auth/signin"
            className="font-bold w-[50%] lg:max-w-[7%] border-[#845AC7] border-2 bg-[#5013AF] py-2 mr-3 hover:bg-purple-900 transition-all text-[#dfdede] hover:text-white inline-flex justify-center items-center rounded-lg"
          >
            <span>login</span>
          </Link>
        )}
      </div>

      {/* Main Content */}
      <div className="hidden lg:block flex-grow pb-28 relative z-10">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <img
              src="ai_search/searching.gif"
              alt="Searching..."
              className="w-[30%]"
            />
          </div>
        ) : (
          <MessagesList messages={messages} />
        )}
      </div>

      {/* Message Form - Positioned at the Bottom */}
      <div className="hidden lg:block w-full absolute bottom-0 left-0 z-50">
        <MessageForm onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
