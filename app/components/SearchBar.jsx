"use client";
import { useState } from "react";
import { GiAtom } from "react-icons/gi";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiMap } from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";

export default function SearchBar({ query, setQuery, handleSubmit }) {
  return (
    <div className="flex justify-between items-center mb-4 mt-10">
      <RxHamburgerMenu className="mx-4" size={28} />
      <div className="w-full justify-center flex gap-6">
        <div className="w-full md:w-[80%] md:max-w-4xl bg-white/45 md:bg-white/20 border-white rounded-2xl sm:rounded-full z-10">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Technical Co-Founder with AI expertise"
              className="w-full py-2 pl-4 rounded-lg bg-white border-1 border-black/40 focus:outline-none text-gray-600"
            />
            <button
              onClick={handleSubmit}
              className="w-1/2 sm:mt-0 sm:h-auto sm:w-auto sm:absolute sm:right-0 sm:top-0 sm:bottom-0 group text-xs md:text-base text-white font-semibold px-3 py-2 rounded-lg transition duration-300"
            >
              <GiAtom
                size={28}
                className="group-hover:rotate-90 transition-all duration-250 text-black"
              />
            </button>
          </div>
        </div>
        <button className="flex text-left items-center border-1 border-black/40 gap-3 py-2 pl-3 pr-10 rounded-lg">
          <FiMap />
          San Jose
        </button>
      </div>
      <button className="rounded-lg">
        <FaRegCircleUser className="" size={32} />
      </button>
    </div>
  );
}
