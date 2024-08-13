/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";

const MessagesList = ({ messages }) => {
  const [expandedProfiles, setExpandedProfiles] = useState({});

  const toggleProfileExpand = (idx) => {
    setExpandedProfiles((prevState) => ({
      ...prevState,
      [idx]: !prevState[idx],
    }));
  };

  return (
    <div className="flex flex-col space-y-4 overflow-y-auto text-white bg-black">
      {messages.length === 0 ? (
        <div className="z-100 flex h-full mt-[8%] items-center justify-center text-7xl font-light text-slate-300">
          <div className="flex flex-col">
            <div className="tracking-tight">
              Find <span className="font-bold mx-4">Your</span> People
            </div>
            <span className="text-lg mt-3 text-slate-400">
              unfamiliar with talentmapp?{" "}
              <Link
                href="/about"
                className="text-slate-500 hover:text-slate-300 font-bold transition-all border-b-[0.5px] border-opacity-60 border-slate-500 hover:border-slate-300"
              >
                learn more
              </Link>
            </span>
          </div>
          <img
            src="ai_search/people.gif"
            alt="Searching..."
            className="w-[25%] self-center ml-5"
          />
        </div>
      ) : (
        // Reverse the messages array to display the most recent first
        [...messages].reverse().map((message) => (
          <div
            key={message._id}
            className={`p-4 ${message.sender === "user" ? "text-gray-100 self-start text-2xl mt-8" : "bg-transparent"}`}
          >
            {message.sender === "user" && (
              <div className="flex font-light border-2 border-white rounded-full py-4 px-12">
                Profiles for:{" "}
                <span className="font-semibold ml-4 text-violet-500">
                  {message.text}
                </span>
              </div>
            )}
            {message.profiles && (
              <div className="space-y-6 bg-black">
                {message.sender === "user" && (
                  <div className="flex font-light border-2 border-white rounded-full py-4 px-12">
                    Profiles for:{" "}
                    <span className="font-semibold ml-4 text-violet-500">
                      {message.text}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 xl:gap-6 bg-black">
                  {message.profiles.map((profile, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800 flex flex-col justify-between xl:justify-around rounded-3xl hover:shadow-lg transition duration-300 ease-in-out"
                    >
                      <div className="flex gap-5 px-8 pt-8">
                        <img
                          src={profile.profilePicture}
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src =
                              "https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2";
                          }}
                          alt={`${profile.firstName} ${profile.lastName}`}
                          className="w-32 h-32 rounded-xl mx-auto"
                        />
                        <div>
                          <h4 className="text-xl xl:text-2xl font-extrabold text-white">{`${profile.firstName} ${profile.lastName}`}</h4>
                          <p>
                            <span className="font-light text-sm xl:text-base">
                              Location:
                            </span>{" "}
                            <span className="font-bold text-sm ">
                              {profile.location}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-gray-300 text-md xl:text-lg px-8 pt-4 pb-4 ${
                          expandedProfiles[idx]
                            ? ""
                            : "max-h-[8rem] overflow-hidden"
                        }`}
                      >
                        {profile.customSummary ? (
                          profile.customSummary
                        ) : (
                          <p>User has no summary</p>
                        )}
                      </div>

                      {profile.customSummary &&
                        profile.customSummary.split(" ").length > 20 &&
                        !expandedProfiles[idx] && (
                          <button
                            className="text-base text-violet-500 font-semibold my-4 focus:outline-none"
                            onClick={() => toggleProfileExpand(idx)}
                          >
                            Read more
                          </button>
                        )}

                      {expandedProfiles[idx] && (
                        <button
                          className="text-base text-violet-500 font-semibold my-4 focus:outline-none"
                          onClick={() => toggleProfileExpand(idx)}
                        >
                          Collapse
                        </button>
                      )}

                      <div className="flex-1 flex flex-col justify-between xl:justify-around h-56 bg-slate-900 mx-4 mb-4 rounded-3xl">
                        <div className="mt-2 gap-2 space-y-2 px-6 pt-6 pb-3">
                          <span className="text-xl font-bold">Strengths:</span>
                          <br />
                          {profile.skills.map((interest, index) => (
                            <span
                              key={index}
                              className="inline-block justify-start bg-[#5013AF] text-white px-4 mr-2 mt-2 py-2 rounded-full text-sm font-semibold"
                            >
                              {interest.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2 px-8 py-4">
                          <span className="font-normal text-lg mr-2">
                            find {profile.firstName} on:{" "}
                          </span>
                          <a
                            href={`https://www.linkedin.com/in/${profile.socialMedia.LinkedIn}`} // Construct the LinkedIn URL
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-200 hover:underline border-[#845AC7] bg-[#5013AF] border-2 hover:scale-105 p-2 mr-2 rounded-xl"
                          >
                            <img
                              src="ai_search/linkedin.png"
                              alt="LinkedIn"
                              className="w-6 h-6"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MessagesList;
