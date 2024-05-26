/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

const About = () => {
  return (
    <div className=" text-white font-mono pb-12 overscroll-none">
      <Link href="/search">
        <span className="font-bold mx-28 border-2 border-opacity-60 p-3 mt-20 hover:text-purple-200 hover:border-purple-200 transition-all hover:scale-105 text-[#dfdede] inline-flex justify-center items-center rounded-lg">
          back to search
        </span>
      </Link>
      <div className="flex flex-col items-center justify-center px-28 py-8">
        <span className="flex items-center font-bold text-8xl">
          Welcome to{" "}
          <img src="/tm-small-logo.png" alt="logo" className="w-[15%]" />{" "}
        </span>

        <div className="flex flex-col gap-7">
          <div className="w-full border-2 rounded-xl flex flex-col z-20">
            <span className="text-4xl border-b-2 py-6 px-12 w-auto bg-gray-900 rounded-t-xl">
              THE VISION //{" "}
              <span className="text-xl text-orange-500">ver. BETA</span>
            </span>
            <div className="p-10 text-xl flex flex-col">
              <span>finding people is easy.</span>
              <span className="pt-2">
                finding the right people? not that easy
              </span>
              <span className="pt-8 font-medium gap-2">
                in the age of levying AI&apos;s insights to drive our everyday
                tasks, finding people is still something we let algorithms do
                without our knowledge via personalized &quot;reccomendations&quot;.
              </span>
              <span className="pt-5 font-bold font-mono gap-2">
                talentmapp takes that algorithm and puts it in your hands.
              </span>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col gap-8">
              <div className="w-full border-2 rounded-xl flex flex-col self-start">
                <span className="text-4xl border-b-2 py-6 px-12 w-auto bg-emerald-900 rounded-t-xl">
                  HOW DO I JOIN?
                </span>
                <div className="p-10 text-xl flex flex-col">
                  <span>Want to be visible to others? </span>
                  <span className="pt-8 font-medium gap-2">
                    Join the waitlist to be one of the first to sign up and
                    create a profile.
                  </span>
                </div>
                <span className="font-bold text-lg py-3 mx-10 mb-6 mt-4 border-white border-[1px] w-[50%] transition-all hover:bg-emerald-900 text-[#dfdede] inline-flex justify-center items-center rounded-lg">
                  <a
                    href="https://jgg07b9ji7m.typeform.com/to/nWBQtOpn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    join waitlist.
                  </a>
                </span>
            </div>
            <div className="w-full text-xl flex justify-center items-center h-24 border-2 rounded-xl bg-opacity-40 bg-violet-900">
                <span>- team talentmapp, with ❤️</span>
            </div>
            </div>
            <div className="w-full border-2 rounded-xl flex flex-col">
              <span className="text-4xl border-b-2 py-6 px-12 w-auto bg-cyan-900 rounded-t-xl">
                FUTURE UPDATES
              </span>
              <div className="p-10 text-xl flex flex-col">
                <span>
                  we&apos;re actively working on making our model sharper and
                  smarter
                </span>
                <span className="pt-4">soon you can expect:</span>
                <ul className="pt-4 font-bold gap-2">
                  <li>- deeper profile insights</li>
                  <li>- engaging profile creation</li>
                  <li>- more than 3 results per search</li>
                  <li>- easier to manage filters</li>
                  <li>- more parameters on display</li>
                </ul>
                <span className="pt-5 font-normal gap-2">
                  anything other features you have in mind? join the waitlist
                  and let the team know
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
