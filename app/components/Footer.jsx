"use client"
import React, { useState } from "react";
import { Button, Link, Input } from "@nextui-org/react";
import axios from 'axios';

const Footer = () => {
  // const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/subscribe', { email });
      if (response.status === 200) {
        setSuccess('Subscription successful! Check your email for a welcome message.');
        // setName('');
        setEmail('');
      }
    } catch (error) {
      setError('Failed to subscribe. Please try again later.');
    }
  };

  return (
    <div className="w-full flex justify-between bg-[#ede7f9] p-20 mt-32">
      <div className="w-1/2 flex flex-col">
        <img src="/tm-logo-full.png" alt="logo" className="w-56" />
        <span className="ml-2 w-[60%] text-slate-500">
          Our mission is to connect like-minded people like never before
        </span>
      </div>
      <div className="flex flex-col text-lg w-[40%]">
        <span className="font-semibold">Join Waitlist</span>
        <span className="font-light text-base mt-2 text-slate-500">
          Get early access to Talentmapp
        </span>
        <form onSubmit={handleSubmit} className="w-2/3 flex flex-col gap-3 mt-5">
          {/* <Input
            required
            type="text"
            label="Name"
            placeholder="Your Name"
            radius="sm"
            className="max-w-sm border-[1.5px] border-slate-300 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          /> */}
          <Input
            required
            type="email"
            label="Email"
            placeholder="your@email.com"
            radius="sm"
            className="border-[1.5px] border-slate-300 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            size="lg"
            radius="sm"
            className="bg-[#5013AF] mt-1 tracking-normal text-white"
          >
            Join
          </Button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2 w-[50%]">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2 w-[50%]">{success}</p>}
      </div>
    </div>
  );
};

export default Footer;
