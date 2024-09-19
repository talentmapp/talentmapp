"use client";
import React, { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoSearch } from "react-icons/io5";

export default function Landing() {
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
    "Technical Co-Founder with AI Expertise",
    "Data Scientist with Machine Learning Skills",
    "Blockchain Developer with FinTech Experience",
    "Creative Director with Branding Expertise",
    "Cybersecurity Expert with Compliance Knowledge",
    "DevOps Engineer with Cloud Infrastructure Experience",
    "Full Stack Developer with JavaScript Expertise",
    "Digital Marketing Strategist with SEO Expertise",
  ];

  return (
    <div className="h-screen md:min-h-screen font-jakarta md:pb-14 w-full flex flex-col items-center md:justify-between relative">
      {/* Blob gradients */}
      <div className="absolute inset-0 z-0 ">
        <div className="w-[50rem] h-[15rem] sm:h-[20rem] bg-[#5013AF] absolute rounded-full opacity-50 blur-3xl -right-16 bottom-20 md:-bottom-12" />
        <div className="w-[50rem] hidden md:block h-[20rem] bg-blue-500 absolute rounded-full opacity-40 blur-3xl -bottom-12 left-1/2 transform -translate-x-1/2" />
        <div className="w-[50rem] h-[15rem] sm:h-[20rem] bg-cyan-700 absolute rounded-full opacity-40 blur-3xl -left-16 -bottom-24 md:-bottom-12" />
      </div>

      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-5 py-5 md:px-10 md:py-5 bg-transparent z-10">
        <RxHamburgerMenu className="mx-4" size={28} />
        <span className="flex gap-3 items-end text-[#1B1B1B] self-center text-2xl md:text-3xl font-bold">
          <img src="/tm-logo.png" alt="logo" className="w-6 md:w-10" />
          talentmapp.
        </span>
        {/* User profile picture
        <img
          src="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" // replace with user's profile image
          alt="User profile"
          className="rounded-full w-10 h-10 md:w-12 md:h-12 object-cover p-1 border-2"
        />
        */}
        <button className="bg-gradient-to-b from-gray-600 to-black text-base text-white py-2 px-4 rounded-lg hover:bg-gray-800">
          Sign Up
        </button>
      </header>

      {/* Main section */}
      <main className="mt-24 px-8 md:px-0 w-full flex flex-col items-center justify-center text-center z-10">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold text-[#000000] leading-tight">
          Noiseless{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-800 to-indigo-600 text-transparent bg-clip-text">
            Networking
          </span>{" "}
          at <br /> your fingertips
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mt-4 mb-10 md:mb-16 md:max-w-2xl">
          Instantly connect with business partners, mentors or collaborators
          using the AI-powered search engine.
        </p>

        {/* Search input with button */}
        <div className="w-full md:w-[80%] md:max-w-4xl bg-white/45 md:bg-white/20 border-white border-1 sm:border-3 rounded-2xl sm:rounded-full p-5 md:py-5 md:px-5 z-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Technical Co-Founder with AI expertise"
              className="w-full py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:pr-36 text-xs md:text-lg rounded-full bg-white shadow-lg focus:outline-none text-gray-600"
            />
            <button className="w-1/2 h-9 mt-3 sm:mt-0 sm:h-auto sm:w-auto sm:absolute sm:right-2 sm:top-2 sm:bottom-2 bg-[#000000] hover:bg-[#333333] text-xs md:text-base text-white font-semibold px-2 md:px-6 md:py-2 rounded-full transition duration-300">
              <IoSearch className="w-full" size={24} />
            </button>
          </div>
        </div>
      </main>

      {/* Scrolling Example Prompts */}
      <div className="relative mt-28 md:mt-8 z-20 w-full overflow-hidden px-2 sm:px-4">
        <div
          className="flex items-center gap-2 mb-3 whitespace-nowrap"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {Array.from({ length: 10 }).map((_, i) =>
            examplePrompts.map((tag, index) => (
              <span
                key={`${i}-${index}`}
                className="p-3 sm:p-4 bg-white/40 text-xs sm:text-sm text-white rounded-2xl shadow-md hover:font-semibold hover:bg-white/70 hover:text-gray-700 border-1 border-white cursor-pointer transition-all duration-250"
              >
                {tag}
              </span>
            )),
          )}
        </div>
        <div
          className="flex items-center gap-2 whitespace-nowrap"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {Array.from({ length: 10 }).map((_, i) =>
            examplePrompts2.map((tag, index) => (
              <span
                key={`${i}-${index}`}
                className="p-3 sm:p-4 bg-white/40 text-xs sm:text-sm text-white rounded-2xl shadow-md hover:font-semibold hover:bg-white/70 hover:text-gray-700 border-1 border-white cursor-pointer transition-all duration-250"
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
