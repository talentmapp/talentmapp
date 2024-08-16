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
    <div className="w-full flex flex-col items-center bg-[#ede7f9] px-8 py-8 md:px-20 mt-24">
      <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between w-full">
        <div className="w-2/3 md:w-1/2 flex flex-col items-center md:items-start">
          <img src="/tm-logo-full.png" alt="logo" className="w-48 md:w-56" />
          <span className="text-sm text-center md:text-left md:text-base ml-2 md:w-[60%] text-slate-500">
            Our mission is to connect like-minded people like never before
          </span>
        </div>
        <div className="flex flex-col h-24 justify-end items-end text-right text-lg mt-12 md:mt-0">
          <span className="font-semibold text-violet-800">LEGAL</span>
          <Link href="/privacy" className="text-slate-800 text-left">
            Privacy Policy
          </Link>
        </div>
      </div>
      <div className="w-full h-[1.5px] bg-[#dbd0f1] mt-8 mb-5"></div>
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
