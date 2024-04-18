/* eslint-disable @next/next/no-img-element */
const MessagesList = ({ messages }) => {
  return (
    <div className="flex flex-col space-y-4 overflow-y-auto text-white">
      {messages.map((message) => (
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
              {/* Matching Profiles For: <span className="font-bold ml-4"> &quot;{message.text}&quot;</span> */}
              Profiles for: <span className="font-semibold ml-4 text-violet-500">{message.text}</span>
            </div>
          )}
          {message.profiles && (
            <div className="space-y-6 ">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {message.profiles.map((profile, idx) => (
                  <div
                    key={idx}
                    className=" bg-gray-700 rounded-3xl hover:shadow-lg transition duration-300 ease-in-out"
                    // className="border border-[#D3CEDC] bg-gray-700 rounded-xl hover:shadow-lg transition duration-300 ease-in-out"
                  >
                    <div className="flex gap-5 px-8 pt-8">
                      <img
                        src={profile.profilePicture}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="w-32 h-32 rounded-xl mx-auto"
                      />
                      <div>
                        <h4 className="text-2xl font-extrabold text-white">{`${profile.firstName} ${profile.lastName}`}</h4>
                        <p>
                          <span className="font-light">Location:</span>{" "}
                          <span className="font-bold">{profile.location}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-lg px-8 pt-6 pb-6">
                      {profile.summary}
                    </p>
                    {/* <div className="bg-slate-900 border-t-2 border-opacity-40 border-[#D3CEDC] rounded-xl"> */}
                    <div className="bg-slate-900 mx-4 mb-4 rounded-3xl">
                      {/* <div className="mt-2 space-y-2 p-6">
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {profile.email}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {profile.phoneNumber}
                        </p>
                      </div> */}
                      <div className="mt-2 gap-2 space-y-2 px-6 pt-6 pb-3">
                        <span className="text-xl font-bold">Strengths:</span>
                        <br></br>
                        {profile.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="inline-block justify-start bg-[#5013AF] text-white px-4 mr-2 mt-2 py-2 rounded-full text-sm font-semibold"
                          >
                            {interest}
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
                        <span className="font-normal text-lg mr-2">find them on: </span>
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
      ))}
    </div>
  );
};

export default MessagesList;
