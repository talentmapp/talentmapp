import { useState } from "react";

const MessageForm = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
      <label className="sr-only">
        Your message
      </label>
      <div className="flex w-[65%] self-center justify-between items-center p-3 bg-gray-950 border border-opacity-25 border-[#D3CEDC] rounded-full">
        <input
          id="chat"
          rows="1"
          type="text"
          autoComplete="off"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="block mx-1 py-3 pl-4 w-[90%] text-sm rounded-full bg-gray-800 border-gray-600 placeholder-gray-400 text-white"
          placeholder='" Find me a Full-Stack Developer with experience in developing E-commerce platforms "'
        ></input>
        <button
          type="submit"
          className="inline-flex justify-center p-2.5 mr-2.5 bg-[#D3CEDC] text-[#5013AF] rounded-full cursor-pointer hover:bg-gray-200"
        >
          <svg
            className="w-6 h-6 rotate-90"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default MessageForm;
