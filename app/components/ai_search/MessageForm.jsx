import { useState, useEffect } from "react";
import { Select } from "@headlessui/react";
import clsx from "clsx";
import { FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";

const MessageForm = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("Anywhere"); // Default location is "Anywhere"
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(70);
  const [userInteracted, setUserInteracted] = useState(false);

  const placeholders = [
    "Find me a Full-Stack Developer E-commerce site",
    "Find me Product Devs in Hyderabad",
    "Find me a UI/UX Designer for a mobile app",
  ];

  useEffect(() => {
    if (userInteracted) return;

    const handleTyping = () => {
      const currentText = placeholders[loopNum];
      setDisplayedText(
        isDeleting
          ? currentText.substring(0, displayedText.length - 1)
          : currentText.substring(0, displayedText.length + 1),
      );

      setTypingSpeed(isDeleting ? 50 : 70);

      if (!isDeleting && displayedText === currentText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setLoopNum((prevLoopNum) => (prevLoopNum + 1) % placeholders.length);
      }
    };

    const typingInterval = setInterval(handleTyping, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [
    displayedText,
    isDeleting,
    loopNum,
    placeholders,
    typingSpeed,
    userInteracted,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(message, location === "Anywhere" ? null : location); // Pass location if it's not "Anywhere"
    setMessage("");
  };

  const handleInputFocus = () => {
    setUserInteracted(true);
  };

  const handleInputBlur = () => {
    setUserInteracted(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 w-full z-50 flex flex-col justify-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
    >
      <label className="sr-only">Your message</label>
      <div className="flex w-[65%] border-slate-600 border-x-[2px] border-t-[2px] pb-5 pt-1 px-4 rounded-t-xl self-center gap-3 justify-between items-center bg-gray-800 relative">
        <div className="flex flex-col w-full">
          <input
            id="chat"
            rows="1"
            type="text"
            autoComplete="off"
            value={message}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={(e) => {
              setMessage(e.target.value);
              setUserInteracted(true);
            }}
            className="block pl-4 resize-none focus:outline-none py-4 w-[90%] text-base bg-gray-800 border-gray-600 placeholder-transparent text-white focus:border-0"
            placeholder="Find me a Full-Stack Developer with experience in developing E-commerce platforms"
          ></input>
          <div className="flex items-center">
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-5 text-slate-300 w-3 h-full" />
              <Select
                value={location}
                onChange={(e) => setLocation(e.target.value)} // Update location state
                className={clsx(
                  "ml-2 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-8 text-sm/6 text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                  "*:text-black",
                )}
              >
                <option>Anywhere</option>
                <option>San Francisco</option>
                <option>Indianapolis</option>
                <option>Dallas</option>
                <option>Pittsburgh</option>
                <option>Chicago</option>
                <option>Austin, TX</option>
              </Select>
              <FaChevronDown
                className="group pointer-events-none absolute top-2.5 right-0 size-4 fill-white/60"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center p-1.5 mr-2.5 bg-[#D3CEDC] text-[#5013AF] rounded-lg cursor-pointer hover:bg-gray-200"
        >
          <svg
            className="w-5 h-5 rotate-90"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
        {!userInteracted && (
          <div className="absolute -top-7 left-3 pl-4 py-4 w-full h-full flex items-center pointer-events-none">
            <span className="text-gray-600 text-base transition-all duration-1000 ease-in-out transform">
              {displayedText}
            </span>
          </div>
        )}
      </div>
    </form>
  );
};

export default MessageForm;
