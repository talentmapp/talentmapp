/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { Button, Link, Input } from "@nextui-org/react";
import axios from "axios";

const Footer = () => {
  // const [name, setName] = useState('');
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/subscribe", { email });
      if (response.status === 200) {
        setSuccess(
          "Subscription successful! Check your email for a welcome message.",
        );
        // setName('');
        setEmail("");
      }
    } catch (error) {
      setError("Failed to subscribe. Please try again later.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center bg-black text-white px-8 py-4 md:px-20 mt-24">
      <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between w-full">
        <div className="w-2/3 md:w-1/2 flex flex-col items-center md:items-start">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-4">
              {/* Add your logo here */}
              <img
                src="/tm-small-logo.png"
                alt="talentmapp logo"
                className="h-10 w-10"
              />
              <span className="text-lg font-semibold">talentmapp</span>
            </div>
          </div>
          <span className="text-sm text-center md:text-left md:text-base ml-2 md:w-[60%] text-slate-500">
            Our mission is to connect like-minded people like never before
          </span>
        </div>
        <div className="flex flex-col h-24 justify-end items-end text-right text-lg mt-12 md:mt-0">
          <span className="font-semibold text-gray-500">LEGAL</span>
          <Link href="/privacy" className="text-slate-300 text-left">
            Privacy Policy
          </Link>
        </div>
      </div>
      <div className="w-full h-[1.5px] bg-gray-700 mt-8 mb-5"></div>
      <div className="text-slate-400 text-sm gap-1 flex flex-col self-start">
        <span>Oinnov Digital Ventures LLP </span>
        <span>
          Flat no. 301 , Sneha Sadan , Officers Colony , RK Puram -
          Secunderabad, Telangana, India, 500056
        </span>
      </div>
    </div>
  );
};

export default Footer;

// "use client";
// import React from "react";

// export default function Footer() {
//   return (
//     <footer className="bg-black text-white py-14 px-24 w-full">
//       <div className="mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
//         {/* Left Section - Logo and Company Name */}
//         <div className="mb-8 md:mb-0">
//           <div className="flex items-center space-x-4">
//             {/* Add your logo here */}
//             <img
//               src="/tm-small-logo.png"
//               alt="talentmapp logo"
//               className="h-10 w-10"
//             />
//             <span className="text-lg font-semibold">talentmapp</span>
//           </div>
//         </div>

//         {/* Middle Section - Use Cases */}
//         <div className="flex flex-col md:flex-row w-3/4 justify-between pr-24">
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Use cases</h3>
//             <ul className="space-y-2 text-sm">
//               <li>UI design</li>
//               <li>UX design</li>
//               <li>Wireframing</li>
//               <li>Diagramming</li>
//               <li>Brainstorming</li>
//               <li>Online whiteboard</li>
//               <li>Team collaboration</li>
//             </ul>
//           </div>

//           {/* Explore Section */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Explore</h3>
//             <ul className="space-y-2 text-sm">
//               <li>Design</li>
//               <li>Prototyping</li>
//               <li>Development features</li>
//               <li>Design systems</li>
//               <li>Collaboration features</li>
//               <li>Design process</li>
//               <li>FigJam</li>
//             </ul>
//           </div>

//           {/* Resources Section */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Resources</h3>
//             <ul className="space-y-2 text-sm">
//               <li>Blog</li>
//               <li>Best practices</li>
//               <li>Colors</li>
//               <li>Color wheel</li>
//               <li>Support</li>
//               <li>Developers</li>
//               <li>Resource library</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
