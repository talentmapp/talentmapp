/* eslint-disable @next/next/no-img-element */
const MessagesList = ({ messages }) => {

  return (
    <div className="flex flex-col space-y-4 overflow-y-auto text-white">
      {messages.map((message, index) => (
        <div key={index} className={`p-4 rounded-md ${message.sender === 'user' ? 'bg-gray-700' : 'bg-gray-500'}`}>
          {message.text}
          {message.profiles && (
            <div className="mt-4 space-y-6">
              <h3 className="text-lg font-bold">Matching Profiles:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {message.profiles.map((profile, idx) => (
                  <div key={idx} className="border-2 rounded-md p-4 hover:shadow-lg transition duration-300 ease-in-out">
                    <img src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png" alt={`${profile.firstName} ${profile.lastName}`} className="w-32 h-32 rounded-full mx-auto mb-4" />
                    <h4 className="text-xl font-semibold">{`${profile.firstName} ${profile.lastName}`}</h4>
                    <p className="text-gray-300">{profile.summary}</p>
                    <div className="mt-4 space-y-2">
                      <p><span className="font-semibold">Location:</span> {profile.location}</p>
                      <p><span className="font-semibold">Email:</span> {profile.email}</p>
                      <p><span className="font-semibold">Phone:</span> {profile.phoneNumber}</p>
                    </div>
                    <div className="mt-4 flex space-x-2 ">
                      {profile.socialMedia.map((social, idx) => (
                        <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:underline bg-blue-500 p-2 rounded-xl">{social.platform}</a>
                      ))}
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
