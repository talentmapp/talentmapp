/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Description,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Select,
} from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import clsx from "clsx";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";

export default function Profile() {
  const { data: session } = useSession(); // Get session data
  const user = session?.user; // Access user data
  const [linkedinUsername, setLinkedinUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handler for generating the profile based on LinkedIn URL
  const handleGenerateProfile = async () => {
    setLoading(true); // Start loading spinner
    try {
      const linkedinUrl = `https://www.linkedin.com/in/${linkedinUsername}`;
      const response = await axios.post("/api/generateProfile", {
        linkedinUrl,
        userEmail: user?.email,
      });

      setMessage("Profile generated successfully!");
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
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <span></span>
      <div className="w-[20rem] rounded-full h-[20rem] bg-[#5013AF] z-10 absolute blur-3xl opacity-15 left-36 bottom-16" />
      <div className="w-[25rem] rounded-full h-[30rem] bg-cyan-700 z-10 absolute blur-3xl opacity-10 right-44 bottom-50" />
      <div className="z-50 w-full max-w-2xl rounded-md">
        <a
          href="/"
          className="text-gray-400 text-center bg-white/10 rounded-md w-[55%] p-2 hover:text-gray-200 hover:bg-slate-600 transition text-xs"
        >
          {" "}
          Back to Search
        </a>
        <Fieldset className="space-y-6 rounded-xl bg-white/5 mt-5 sm:p-10 ">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <Legend className="text-3xl font-semibold text-white">
                Account Details
              </Legend>
              <span className="w-[90%] text-sm text-neutral-500/80 font-light mt-2">
                Populate profile with data from your LinkedIn account.
              </span>
            </div>
            {user ? (
              <img
                src={user.image}
                alt="Profile"
                className="rounded-full w-[1/2] h-[1/2] mx-5 cursor-pointer border-3 border-dotted border-gray-600 p-1.5"
                tabIndex="0"
              />
            ) : (
              ""
            )}
          </div>
          <Field>
            <Label className="text-sm/6 font-medium text-white">Name</Label>
            <Input
              className={clsx(
                "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
              )}
              placeholder={user?.name}
            />
          </Field>
          <Field>
            <Label className="text-sm/6 font-medium text-white">
              LinkedIn URL
            </Label>
            <div className="flex my-3">
              <span className="bg-gray-700 text-white py-1.5 px-3 rounded-l-lg text-sm/6">
                https://www.linkedin.com/in/
              </span>
              <Input
                className={clsx(
                  "block w-full rounded-r-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                )}
                value={linkedinUsername}
                onChange={(e) => setLinkedinUsername(e.target.value)}
                placeholder="your-username"
              />
            </div>
          </Field>
          <button
            className="py-2 px-3 mt-5 text-sm bg-gray-700 hover:bg-[#5013AF] bg-opacity-40 hover:bg-opacity-60 transition text-white rounded-md"
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
            <p className="text-sm text-white mt-3 text-center">{message}</p>
          )}
        </Fieldset>
      </div>
    </div>
  );
}
