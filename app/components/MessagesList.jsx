// components/MessagesList.js
const MessagesList = ({ messages }) => {
  return (
     <div className="space-y-4">
       {messages.map((message, index) => (
         <div key={index} className={`p-4 rounded-md ${message.sender === 'user' ? 'bg-gray-200' : 'bg-blue-200'}`}>
           {message.text}
           {/* Check if the message contains a list of profiles */}
           {message.profiles && (
             <div className="mt-4">
               <h3 className="text-lg font-bold">Matching Profiles:</h3>
               <ul className="list-disc pl-5">
                 {message.profiles.map((profile, idx) => (
                   <li key={idx}>
                     <p>{profile.name}</p>
                     <p>{profile.experience}</p>
                     {/* Add more profile details as needed */}
                   </li>
                 ))}
               </ul>
             </div>
           )}
         </div>
       ))}
     </div>
  );
};

export default MessagesList;
