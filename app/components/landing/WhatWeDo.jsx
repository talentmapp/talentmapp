"use client";
import { useState } from "react";
import Image from "next/image";

export default function WhatWeDo() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Array for different slide content
  const slideContent = [
    {
      title: "AI-Powered People Search Engine",
      description:
        "Unlike traditional directory-based searches, talentmapp's AI-Powered Search uses natural language processing (NLP) and machine learning algorithms to match users with professionals based on specific skills, expertise, and interests.",
      imageSrc: "/whatwedo1.png",
    },
    {
      title: "AI-Powered People Search Engine",
      description:
        "Unlike traditional directory-based searches, talentmapp's AI-Powered Search uses natural language processing (NLP) and machine learning algorithms to match users with professionals based on specific skills, expertise, and interests.",
      imageSrc: "/whatwedo1.png",
    },
    {
      title: "AI-Powered People Search Engine",
      description:
        "Unlike traditional directory-based searches, talentmapp's AI-Powered Search uses natural language processing (NLP) and machine learning algorithms to match users with professionals based on specific skills, expertise, and interests.",
      imageSrc: "/whatwedo1.png",
    },
    // Add more slides here if needed
  ];

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === slideContent.length - 1 ? 0 : prevSlide + 1,
    );
  };

  const goToPreviousSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slideContent.length - 1 : prevSlide - 1,
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-between w-full px-8 md:px-44 py-20">
      {/* Text Section */}
      <div className="w-full px-28 h-[1px] mb-8 bg-[#E5E5E5]" />

      <div className="w-full mb-12 mx-32 md:mb-0">
        <div className="w-3/5">
          <h2 className="text-[#FF730C] flex items-center text-sm font-semibold uppercase mb-2">
            <div className="bg-[#FF730C] w-3 h-3 mr-2 rounded-full" /> What we
            do
          </h2>
          <h1 className="text-3xl md:text-4xl font-semibold mb-6 mt-10 leading-tight">
            Connecting people to enable powerful outcomes, every day.
          </h1>
        </div>

        <div className="flex p-5 mt-16 border-[#B8B8B8]/50 border-[1px] justify-between bg-[#F7F7F7]/20 rounded-xl w-full">
          <div className="w-1/2 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-semibold mb-4 mt-5">
                {slideContent[currentSlide].title}
              </h3>
              <p className="text-base text-gray-600 mt-9">
                {slideContent[currentSlide].description}
              </p>
            </div>

            {/* Slide Indicator and Navigation */}
            <div className="flex items-center justify-start mt-6">
              <div className="mx-4 flex space-x-2">
                {slideContent.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full ${
                      index === currentSlide ? "bg-[#FF730C]" : "bg-gray-300"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          {/* Image Section */}
          <div className="w-2/3 flex justify-end">
            <img
              src={slideContent[currentSlide].imageSrc}
              alt="What we do image"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
