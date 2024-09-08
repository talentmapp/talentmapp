// pages/index.tsx
"use client";
import React, { useEffect, useState } from "react";

export default function LandingPage() {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Infinite scroll effect for the tags
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prevPosition) =>
        prevPosition < 10000 ? prevPosition + 1 : 0,
      );
    }, 30); // Adjust speed here
    return () => clearInterval(interval);
  }, []);

  const examplePrompts = [
    "Marketing Guru with Tech Background",
    "Product Manager with Design Eye",
    "Content Creator with Tech Knowledge",
    "Business Development Pro",
    "UX Designer with Startup Experience",
    "Sales Expert with Startup Experience",
    "Growth Specialist with Marketing Expertise",
  ];
  const examplePrompts2 = [
    "Business Development Pro",
    "UX Designer with Startup Experience",
    "Product Manager with Design Eye",
    "Growth Specialist with Marketing Expertise",
    "Sales Expert with Startup Experience",
    "Content Creator with Tech Knowledge",
    "Marketing Guru with Tech Background",
  ];

  return (
    <div className="min-h-screen font-jakarta pb-14 w-full flex flex-col items-center justify-between bg-[#f6f6f6] relative overflow-hidden">
      {/* Blob gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Right purple blob */}
        <div className="w-[45rem] h-[20rem] bg-[#5013AF] absolute rounded-full opacity-40 blur-3xl -right-16 -bottom-36" />
        {/* Left blue blob */}
        <div className="w-[50rem] h-[30rem] bg-blue-400 absolute rounded-full opacity-40 blur-3xl -bottom-36" />
        {/* Left cyan blob */}
        <div className="w-[45rem] h-[30rem] bg-cyan-700 absolute rounded-full opacity-40 blur-3xl -left-16 -bottom-36" />
      </div>

      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-10 py-5 bg-transparent z-10">
        <img src="/tm-logo.png" alt="logo" className="w-10" />
        <span className="text-[#1B1B1B] text-3xl font-bold">talentmapp.</span>
        {/* User profile picture */}
        <img
          src="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" // replace with user's profile image
          alt="User profile"
          className="rounded-full w-12 h-12 object-cover p-1 border-2"
        />
      </header>

      {/* Main section */}
      <main className="mt-24 w-full flex flex-col items-center justify-center text-center z-10">
        <h1 className="text-4xl sm:text-6xl font-semibold text-[#000000]">
          Noiseless Networking at <br /> your fingertips
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mt-4 mb-16 max-w-2xl">
          Find your next business partner, mentor, or collaborator instantly
          with our AI-powered algorithm based on your skills, industry, and
          goals.
        </p>

        {/* Search input with button */}
        <div className="w-[75%] bg-white/20 border-white border-4 rounded-full py-10 px-24 z-10">
          <div className="relative ">
            <input
              type="text"
              placeholder="Technical Co-Founder with AI expertise"
              className="w-full py-4 px-6 text-lg rounded-full bg-white shadow-lg focus:outline-none text-gray-600"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-[#000000] hover:bg-[#333333] text-white font-semibold px-6 py-2 rounded-full transition duration-300">
              Start Scanning
            </button>
          </div>
        </div>
      </main>

      {/* Scrolling Example Prompts */}
      <div className="relative mt-6 z-20 w-full overflow-hidden">
        <div
          className="flex items-center gap-3 mb-3 whitespace-nowrap"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {Array.from({ length: 10 }).map((_, i) =>
            examplePrompts.map((tag, index) => (
              <span
                key={`${i}-${index}`}
                className="p-4 bg-white/40 text-sm text-white rounded-md shadow-md hover:bg-white/20 border-1 border-white cursor-pointer transition"
              >
                {tag}
              </span>
            )),
          )}
        </div>
        <div
          className="flex items-center gap-3 whitespace-nowrap"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {Array.from({ length: 10 }).map((_, i) =>
            examplePrompts2.map((tag, index) => (
              <span
                key={`${i}-${index}`}
                className="p-4 bg-white/40 text-sm text-white rounded-md shadow-md hover:bg-white/20 border-1 border-white cursor-pointer transition"
              >
                {tag}
              </span>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
