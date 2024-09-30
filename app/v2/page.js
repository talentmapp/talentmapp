"use client";
import React, { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiAtom } from "react-icons/gi";
import { GoArrowUpRight } from "react-icons/go";

import WhatWeDo from "../components/landingv2/WhatWeDo";
import FAQSection from "../components/landingv2/FAQ";
import LandingBottom from "../components/landingv2/LandingBottom";
import Footer from "../components/landingv2/Footer";

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
    "Data Scientist with Machine Learning Skills",
    "Technical Co-Founder with AI Expertise",
    "DevOps Engineer with Cloud Infrastructure Experience",
    "Blockchain Developer with FinTech Experience",
    "Creative Director with Branding Expertise",
    "Cybersecurity Expert with Compliance Knowledge",
    "Full Stack Developer with JavaScript Expertise",
    "Digital Marketing Strategist with SEO Expertise",
  ];

  return (
    <div className=" font-jakarta w-full flex flex-col items-center md:justify-between relative bg-white">
      {/* BG Circles */}
      <div className="absolute inset-0 z-0 left-auto right-auto">
        <img src="/circles.png" className="opacity-80" />
      </div>

      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-5 py-5 md:px-10 md:py-5 bg-transparent z-10">
        <RxHamburgerMenu className="mx-4" size={28} />
        <span className="flex gap-3 items-end text-[#1B1B1B] self-center text-2xl md:text-3xl font-bold">
          <img src="/tm.png" alt="logo" className="w-6 md:w-10" />
          talentmapp.
        </span>
        {/* User profile picture
        <img
          src="https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2" // replace with user's profile image
          alt="User profile"
          className="rounded-full w-10 h-10 md:w-12 md:h-12 object-cover p-1 border-2"
        />
        */}
        <button className="bg-[#FFEADB] border-[#FFDDC5] border-[1px] text-sm text-[#FF730C] font-medium py-3 px-5 rounded-lg transition-all duration-200 hover:bg-[#FF730C]/70 hover:text-white">
          Sign Up
        </button>
      </header>

      {/* Main section */}
      <main className="mt-52 px-8 md:px-0 w-full flex flex-col items-center justify-center text-center z-10">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold text-[#000000] leading-tight">
          <span className="text-[#FF730C]">Noiseless </span>
          Networking at <br /> your fingertips
        </h1>

        {/* Search input with button */}
        <div className="w-full md:w-[80%] md:max-w-4xl bg-white/45 md:bg-white/20 border-white rounded-2xl sm:rounded-full p-5 md:py-5 md:px-5 mt-10 z-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Technical Co-Founder with AI expertise"
              className="w-full py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:pr-36 text-xs md:text-lg rounded-lg bg-white border-2 border-black focus:outline-none text-gray-600"
            />
            <button className="w-1/2 h-9 sm:mt-0 sm:h-auto sm:w-auto sm:absolute sm:right-2 sm:top-2 sm:bottom-2 bg-[#000000] group hover:bg-[#333333] text-xs md:text-base text-white font-semibold px-3 py-2 rounded-lg transition duration-300">
              <GiAtom
                size={32}
                className="group-hover:rotate-90 transition-all duration-250"
              />
            </button>
          </div>
        </div>
      </main>

      {/* Scrolling Example Prompts */}
      <div className="relative mt-28 z-20 w-full px-2 sm:px-4">
        <div
          className="flex items-center gap-2 mb-3 whitespace-nowrap"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {Array.from({ length: 10 }).map((_, i) =>
            examplePrompts.map((tag, index) => (
              <span
                key={`${i}-${index}`}
                className="flex items-center justify-center p-3 sm:p-4 bg-[#F7F7F7] hover:bg-[#E9E9E9] text-xs sm:text-sm text-black rounded-xl hover:font-semibold hover:bg-white/70 hover:text-gray-700 border-1 border-white cursor-pointer transition-all duration-250"
              >
                {tag} <GoArrowUpRight size={21} className="ml-3 mt-1" />
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
                className="flex items-center justify-center p-3 sm:p-4 bg-[#F7F7F7] hover:bg-[#E9E9E9] text-xs sm:text-sm text-black rounded-xl hover:font-semibold hover:bg-white/70 hover:text-gray-700 border-1 border-white cursor-pointer transition-all duration-250"
              >
                {tag} <GoArrowUpRight size={21} className="ml-3 mt-1" />
              </span>
            )),
          )}
        </div>
      </div>
      <WhatWeDo />
      <FAQSection />
      <LandingBottom />
      <Footer />
    </div>
  );
}
