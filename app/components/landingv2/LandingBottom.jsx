"use client";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

export default function LandingBottom() {
  return (
    <div className="py-24 w-full flex flex-col justify-center items-center font-jakarta">
      <div className="relative w-3/4 rounded-lg border-[#B8B8B8]/50 border-[1px]">
        {/* Gradient Shadow */}
        {/*  <div className="absolute w-1/2 -inset-1 rounded-lg bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 opacity-25 blur-lg z-0 pointer-events-none"></div> */}

        {/* Image */}
        <img
          src="/start-connecting.png"
          className="w-full relative z-10 rounded-xl"
        />

        {/* Overlay container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to start connecting?
          </h2>
          <p className="text-gray-600 text-lg md:text-xl mb-6 w-4/5 sm:w-2/5">
            Finding the right talent to connect with for your dream network or
            next big project has never been easier.
          </p>
          <button className="bg-[#FFEADB] border-[#FFDDC5] border-[1px] text-base text-[#FF730C] font-medium py-3 px-6 rounded-lg  transition-all duration-200 hover:bg-orange-200">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
