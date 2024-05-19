/* eslint-disable @next/next/no-img-element */
"use client";
import { useRef } from "react";
import NavBar from "../components/Navbar";
import { Button, Link } from "@nextui-org/react";

import Footer from "../components/Footer";

const data = {
  cards: [
    {
      image: "/cards/nlp.png",
      header: "NLP-Based Discovery Engine",
      content:
        "Input natural language queries to find professionals and opportunities that align perfectly with your needs. Our AI-driven search provides precise and relevant results, enhancing your networking experience.",
    },
    {
      image: "/cards/ai.png",
      header: "AI-Powered Assistant",
      content:
        "Input natural language queries to find professionals and opportunities that align perfectly with your needs. Our AI-driven search provides precise and relevant results, enhancing your networking experience.",
    },
    {
      image: "/cards/network.png",
      header: "Networking and Collaboration",
      content:
        "Build meaningful professional relationships through our sophisticated networking features. Share insights, collaborate on projects, and connect with like-minded professionals effortlessly.",
    },
  ],
};

export default function Home() {
  const footerRef = useRef(null);

  // Function to handle scrolling to the footer
  const scrollToFooter = () => {
    // Check if the footer ref exists
    if (footerRef.current) {
      // Scroll to the footer section
      footerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-white font-jakarta">
      <div className="bg-[#5013AF] h-12 w-full flex items-center justify-center relative">
        <div className="">
          <span className="text-[#DDD1F0] font-jakarta font-extralight">
            For product announcements and exclusive insights.{" "}
          </span>
          <button
            onClick={scrollToFooter}
            size="lg"
            radius="sm"
            className="mx-2 tracking-normal text-white"
          >
            Join Waitlist
          </button>
        </div>
        <img src="banner-overlay.svg" alt="overlay" className="-z-1 absolute pointer-events-none" />
      </div>
      <NavBar ref={footerRef} />
      {/* SECTION 1 */}
      <div className="flex items-center justify-between w-full px-16">
        <div className="w-[50%] py-24  flex flex-col text-6xl font-bold tracking-tight">
          <span className=" ">Discover the Right</span>
          <span className="text-[#5013AF]">Connections</span>
          <span>Faster Than Ever</span>
          <span className="font-light text-lg mt-3 w-4/5 tracking-normal">
            Harness the power of AI to refine and expedite your professional
            networking.
          </span>
          <Button
            as={Link}
            href="/"
            size="lg"
            radius="sm"
            className="bg-[#5013AF] w-1/3 mt-9 tracking-normal text-white"
          >
            Start Your Search
          </Button>
        </div>
        <div className="w-[50%]">
          <img src="hero-image.png" alt="hero" className="self-end" />
        </div>
      </div>
      {/* SECTION 2 */}
      <div className="w-11/12 flex flex-col justify-center items-center text-center mt-52">
        <span className="text-4xl font-semibold w-1/2">
          Take the next step & get results faster
        </span>
        <div className="flex gap-14 text-left justify-between mt-16 w-full">
          {data.cards.map((card, index) => (
            <div
              key={index}
              className="flex flex-col justify-between bg-white shadow-2xl shadow-[#9986b6] w-1/3 p-5 rounded-xl"
            >
              <img
                src={card.image}
                alt={card.header}
                className="w-1/4 h-auto"
              />
              <span className="text-4xl font-semibold">{card.header}</span>

              <span className="text-lg font-light mt-2">{card.content}</span>
              <Button
                as={Link}
                href="#"
                size="lg"
                radius="sm"
                className="bg-[#5013AF] py-6 mt-3 tracking-normal text-white"
              >
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="mt-32 w-full ">
          <ProgressSlider items={items} />
        </div> */}
      <div className="flex items-center mt-32 w-11/12 bg-[#ede7f9] rounded-lg">
        <div className="flex flex-col py-24 px-14 w-[50%]">
          <span className="text-5xl font-bold">Get started!</span>
          <span className="mt-3 text-lg font-light">
            Are you ready to transform your professional network? Join
            Talentmapp today.
          </span>
          <Button
            as={Link}
            href="#"
            size="lg"
            radius="sm"
            className="bg-[#5013AF] w-1/4 py-6 mt-5 tracking-normal text-white"
          >
            Try Now
          </Button>
        </div>
        <img src="/get-started.png" alt="people" className="w-[50%]" />
      </div>
      <div className="w-full" ref={footerRef}>

      <Footer  />
      </div>
    </main>
  );
}
