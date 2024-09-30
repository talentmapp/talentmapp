/* eslint-disable @next/next/no-img-element */
"use client";

import { Fieldset, Input, Legend } from "@headlessui/react";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function Profile() {
  const { data: session, status } = useSession();
  const loadingSession = status === "loading";

  const [linkedinUsername, setLinkedinUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handler for generating the profile based on LinkedIn URL
  const handleGenerateProfile = async () => {
    setLoading(true); // Start loading spinner
    setMessage(""); // Clear any previous messages
    try {
      const linkedinUrl = `https://www.linkedin.com/in/${linkedinUsername}`;
      const response = await axios.post("/api/generateProfile", {
        linkedinUrl,
        userEmail: session?.user?.email,
      });

      if (response.data.success) {
        setMessage("Profile generated successfully!");
      } else {
        setMessage("Failed to generate profile. Please try again.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error ===
          "You can only generate your profile once a week."
      ) {
        setMessage("You can only generate your profile once a week.");
      } else {
        setMessage("An error occurred while generating the profile.");
      }
      console.error("Profile generation error:", error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="h-screen w-full flex flex-col mt-32 items-center">
      <div className="z-50 w-full rounded-md">
        <div className="flex mx-56 gap-3 justify-start">
          <a
            href="/"
            className="text-gray-400 text-center bg-white/10 rounded-md w-[12%] p-2 hover:text-gray-200 hover:bg-slate-600 transition text-xs"
          >
            {" "}
            Back to Search
          </a>
        </div>
        <Fieldset className="space-y-6 mx-56 rounded-xl bg-white/5 mt-5 sm:p-10">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <Legend className="text-3xl font-semibold text-black">
                Account Details
              </Legend>
              <span className="w-[90%] text-sm text-neutral-500/80 font-light mt-2">
                Populate profile with data from your LinkedIn account.
              </span>
            </div>
            {!loadingSession && session?.user ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="rounded-full w-[1/2] h-[1/2] mx-5 cursor-pointer border-3 border-dotted border-gray-600 p-1.5"
                tabIndex="0"
              />
            ) : (
              ""
            )}
          </div>
          <div>
            <label className="text-sm/6 font-medium text-black">Name</label>
            <Input
              className={clsx(
                "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-black",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
              placeholder={session?.user?.name}
            />
          </div>
          <button
            className="py-2 px-3 mt-5 text-sm bg-gray-100 hover:bg-gray-300 bg-opacity-40 hover:bg-opacity-60 transition text-black rounded-md"
            onClick={handleGenerateProfile}
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white inline-block"></span>
            ) : (
              "Generate Profile"
            )}
          </button>
          {message && (
            <p className="text-sm text-black mt-3 text-center">{message}</p>
          )}
        </Fieldset>
        <div className="flex justify-center mt-4 space-x-3">
          {/* Step Indicator */}
          <span className="block h-2 w-10 rounded-full bg-black" />
          <span className="block h-2 w-10 rounded-full bg-gray-300" />
          <span className="block h-2 w-10 rounded-full bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
