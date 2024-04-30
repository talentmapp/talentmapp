/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

const MessagesList = ({ messages }) => {
  const [expandedProfiles, setExpandedProfiles] = useState({});

  const toggleProfileExpand = (idx) => {
    setExpandedProfiles((prevState) => ({
      ...prevState,
      [idx]: !prevState[idx],
    }));
  };

  return (
    <div className="flex flex-col space-y-4 overflow-y-auto text-white">
      {messages.length === 0 ? (
        <div className="z-100 flex h-full mt-[8%] items-center tracking-tight justify-center text-7xl font-light text-slate-300">
          Find <span className="font-bold mx-4">Your</span> People
          <img
            src="/people.gif"
            alt="Searching..."
            className="w-[25%] self-center ml-5"
          />
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message._id} // Use a unique identifier like _id
            className={`p-4 ${
              message.sender === "user"
                ? "text-gray-100 self-start text-2xl mt-8"
                : "bg-transparent"
            }`}
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 xl:gap-6">
                  {message.profiles.map((profile, idx) => (
                    <div
                      key={idx}
                      className=" bg-gray-800 flex flex-col justify-between xl:justify-around rounded-3xl hover:shadow-lg transition duration-300 ease-in-out"
                      // className="border border-[#D3CEDC] bg-gray-700 rounded-xl hover:shadow-lg transition duration-300 ease-in-out"
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
                        className={`text-gray-300 text-md xl:text-lg px-8 pt-6 pb-4 ${
                          expandedProfiles[idx]
                            ? ""
                            : "max-h-[6rem] overflow-hidden"
                        }`}
                      >
                        {profile.summary}
                      </div>
                      {profile.summary.split(" ").length > 15 &&
                        !expandedProfiles[idx] && (
                          <button
                            className="text-base text-violet-500 font-semibold my-4 focus:outline-none"
                            onClick={() => toggleProfileExpand(idx)}
                          >
                            Read more
                          </button>
                        )}

                      {
                        (expandedProfiles[idx]) && (
                          <button
                            className="text-base text-violet-500 font-semibold my-4 focus:outline-none"
                            onClick={() => toggleProfileExpand(idx)}
                          >
                            Collapse
                          </button>
                        )}

                      <div className="flex-1 flex flex-col justify-between max-h-[75%] xl:justify-around bg-slate-900 mx-4 mb-4 rounded-3xl">
                        <div className="mt-2 gap-2 space-y-2 px-6 pt-6 pb-3">
                          <span className="text-xl font-bold">Strengths:</span>
                          <br></br>
                          {profile.skills.map((interest, index) => (
                            <span
                              key={index}
                              className="inline-block justify-start bg-[#5013AF] text-white px-4 mr-2 mt-2 py-2 rounded-full text-sm font-semibold"
                            >
                              {interest.name}
                            </span>
                          ))}
                        </div>
                        <div className="gap-2 space-y-2 p-6">
                          <span className="text-xl font-bold">
                            {profile.firstName} is fluent in:
                          </span>
                          <br></br>
                          {profile.languages.map((language, index) => (
                            <span
                              key={index}
                              className="inline-block justify-start bg-[#5013AF] text-white px-4 mr-2 mt-2 py-2 rounded-full text-sm font-semibold"
                            >
                              {language.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2 px-8 py-4">
                          <span className="font-normal text-lg mr-2">
                            find them on:{" "}
                          </span>
                          {profile.socialMedia.map((social, idx) => (
                            <a
                              key={idx}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-200 hover:underline border-[#845AC7] bg-[#5013AF] border-2 hover:scale-105 p-2 mr-2 rounded-xl"
                            >
                              {social.platform === "LinkedIn" ? (
                                <img
                                  src="/linkedin.png"
                                  alt="LinkedIn"
                                  className="w-6 h-6"
                                />
                              ) : social.platform === "GitHub" ? (
                                <img
                                  src="/github.png"
                                  alt="GitHub"
                                  className="w-6 h-6"
                                />
                              ) : social.platform === "Behance" ? (
                                <img
                                  src="/Behance.png"
                                  alt="Behance"
                                  className="w-6 h-6"
                                />
                              ) : (
                                social.platform
                              )}
                            </a>
                          ))}
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
