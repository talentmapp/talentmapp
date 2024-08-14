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
        <div className="flex items-center text-[10px] md:text-base justify-center w-full px-4 sm:px-8 md:px-16">
          <span className="text-[#DDD1F0] font-jakarta font-extralight">
            For product announcements and exclusive insights.
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
        <img
          src="banner-overlay.svg"
          alt="overlay"
          className="object-cover object-left md:object-contain -z-1 h-full absolute pointer-events-none"
        />
      </div>
      <NavBar ref={footerRef} />
      {/* SECTION 1 */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="w-full md:w-1/2 py-12 md:py-24 flex flex-col text-center md:text-left text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
          <span className="">Discover the Right</span>
          <span className="text-[#5013AF]">Connections</span>
          <span>Faster Than Ever</span>
          <span className="font-light text-base sm:text-lg mt-5 md:mt-3 px-12 md:px-0 md:w-4/5 tracking-normal">
            Harness the power of AI to refine and expedite your professional
            networking.
          </span>
          <Button
            as={Link}
            href="/"
            size="lg"
            radius="sm"
            className="bg-[#5013AF] w-1/2 md:w-1/3 mt-8 md:mt-9 tracking-normal text-white self-center md:self-start"
          >
            Start Your Search
          </Button>
        </div>
        <div className="w-11/12 md:w-1/2">
          <img
            src="hero-image.png"
            alt="hero"
            className="self-center md:self-end"
          />
        </div>
      </div>
      {/* SECTION 2 */}
      <div className="w-11/12 flex flex-col justify-center items-center text-center mt-24 md:mt-32 xl:mt-52">
        <span className="text-2xl xl:text-4xl font-semibold w-10/12 sm:w-1/2">
          Take the next step & get results faster
        </span>
        <div className="grid grid-rows-3 md:flex md:justify-between gap-7 xl:gap-14 text-left mt-10 md:mt-16 w-5/6 md:w-full">
          {data.cards.map((card, index) => (
            <div
              key={index}
              className="flex flex-col justify-between bg-white shadow-xl md:shadow-2xl shadow-[#d8cee7] md:w-1/3 p-5 rounded-xl"
            >
              <img
                src={card.image}
                alt={card.header}
                className="w-1/4 h-auto"
              />
              <span className="text-2xl xl:text-4xl font-semibold text-[#5013AF]">
                {card.header}
              </span>

              <span className="text-base xl:text-lg font-light mt-2">
                {card.content}
              </span>
              {/* <Button
                as={Link}
                href="#"
                size="lg"
                radius="sm"
                className="bg-[#5013AF] py-6 mt-3 tracking-normal text-white"
              >
                Learn More
              </Button> */}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center mt-32 w-10/12 md:w-11/12 bg-[#ede7f9] rounded-lg">
        <div className="flex flex-col my-9 xl:my-24 px-14 md:w-1/2">
          <span className="text-3xl md:text-4xl xl:text-5xl font-bold">
            Get started!
          </span>
          <span className="mt-3 text-base xl:text-lg font-light">
            Are you ready to transform your professional network? Join
            Talentmapp today.
          </span>
          <Button
            as={Link}
            href="/"
            radius="sm"
            className="bg-[#5013AF] w-1/4 md:w-1/2 text-sm p-3 md:text-base md:py-6 md:px-3 mt-5 tracking-normal text-white"
          >
            Try Now
          </Button>
        </div>
        <img
          src="/get-started.png"
          alt="people"
          className="md:w-3/5 xl:w-1/2 rounded-b-lg md:rounded-none"
        />
      </div>
      <div className="w-full" ref={footerRef}>
        <Footer />
      </div>
    </main>
  );
}
