"use client";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

export default function LandingBottom() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center font-jakarta">
      <div className="relative w-11/12 mx-auto">
        {/* Gradient Shadow */}
        <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 opacity-25 blur-lg z-0 pointer-events-none"></div>

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
          <button className="bg-gradient-to-b from-gray-600 to-black text-white py-2 px-6 rounded-lg hover:bg-gray-800">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
