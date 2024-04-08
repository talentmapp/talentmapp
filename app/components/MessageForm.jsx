// components/MessageForm.js
import { useState } from 'react';

const MessageForm = ({ onSendMessage }) => {
 const [message, setMessage] = useState('');

 const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage('');
 };

 return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-5">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow p-2 text-black rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        placeholder="Type your message..."
      />
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Send</button>
    </form>
 );
};

export default MessageForm;
