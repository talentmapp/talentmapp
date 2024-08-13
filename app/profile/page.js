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
  Textarea,
} from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import clsx from "clsx";

import { useSession, signOut } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession(); // Get session data
  const user = session?.user; // Access user data

  console.log(session?.user)

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <span></span>
      <div className="w-[20rem] rounded-full h-[20rem] bg-[#5013AF] z-10 absolute blur-3xl opacity-15 left-36 bottom-16" />
      <div className="w-[25rem] rounded-full h-[30rem] bg-cyan-700 z-10 absolute blur-3xl opacity-10 right-44 bottom-50" />
      <div className="z-50 w-full max-w-2xl rounded-md">
        <Fieldset className=" space-y-6 rounded-xl bg-white/5 p-6 sm:p-10 ">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
            <a href="/search" className="text-gray-600 mb-4 hover:text-gray-400 transition text-sm"> Back to Search</a>
            <Legend className="text-3xl font-semibold text-white">
              Account Details
            </Legend>
            </div>
            {user ? (
              <img
                src={user.image}
                alt="Profile"
                className="rounded-full w-[1/2] h-[1/2] mx-5 cursor-pointer border-3 border-dotted border-gray-600 p-1.5"
                tabIndex="0" // Make the profile image focusable
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
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
              placeholder={user?.name}
            />
          </Field>
          <Field>
            <Label className="text-sm/6 font-medium text-white">City</Label>
            <Description className="text-sm/6 text-white/50">
              More country options coming soon
            </Description>
            <div className="relative">
              <Select
                className={clsx(
                  "mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                  // Make the text of each option black on Windows
                  "*:text-black"
                )}
              >
                <option>San Francisco</option>
                <option>Pittsburgh</option>
                <option>Chicago</option>
                <option>Austin, TX</option>
              </Select>
              <FaChevronDown
                className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                aria-hidden="true"
              />
            </div>
          </Field>
          <Field>
            <Label className="text-sm/6 font-medium text-white">
              About You
            </Label>
            {/* <Description className="text-sm/6 text-white/50">
              100 word limit
            </Description> */}
            <Textarea
              className={clsx(
                "mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
              rows={3}
              placeholder={user?.customSummary}
            />
          </Field>
          <button className="py-2 px-3 mt-2 text-sm bg-gray-700 hover:bg-[#5013AF] bg-opacity-40 hover:bg-opacity-60 transition text-white rounded-md">Save Changes</button>
        </Fieldset>
      </div>
    </div>
  );
}
