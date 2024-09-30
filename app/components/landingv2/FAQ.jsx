"use client";
import { useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

export default function FAQSection() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqData = [
    {
      question: "Who is Talentmapp for?",
      answer:
        "Talentmapp is designed for professionals looking to enhance their networking experience and build meaningful connections.",
    },
    {
      question: "Who is Talentmapp for?",
      answer:
        "Talentmapp is designed for professionals looking to enhance their networking experience and build meaningful connections.",
    },
    {
      question: "Who is Talentmapp for?",
      answer:
        "Talentmapp is designed for professionals looking to enhance their networking experience and build meaningful connections.",
    },
    {
      question: "Who is Talentmapp for?",
      answer:
        "Talentmapp is designed for professionals looking to enhance their networking experience and build meaningful connections.",
    },
    {
      question: "Who is Talentmapp for?",
      answer:
        "Talentmapp is designed for professionals looking to enhance their networking experience and build meaningful connections.",
    },
    {
      question: "Who is Talentmapp for?",
      answer:
        "Talentmapp is designed for professionals looking to enhance their networking experience and build meaningful connections.",
    },
  ];

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-start justify-between px-8 md:px-44 pt-24 pb-12">
      {/* Left Side: FAQ Heading */}
      <div className="w-full md:w-1/2 mb-8 md:mb-0">
        <h2 className="text-3xl font-semibold mb-4">FAQs</h2>
        <p className="text-sm text-gray-500">
          For any further questions, send us a message at hello@talentmapp.co
        </p>
      </div>

      {/* Right Side: FAQ List */}
      <div className="w-full md:w-1/2">
        {faqData.map((faq, index) => (
          <div key={index} className="border-b border-gray-300 py-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAccordion(index)}
            >
              <h3 className="text-lg font-medium text-gray-700">
                {faq.question}
              </h3>
              {expandedIndex === index ? (
                <AiOutlineMinus size={20} className="text-gray-500" />
              ) : (
                <AiOutlinePlus size={20} className="text-gray-500" />
              )}
            </div>

            {/* Adding a smooth transition effect */}
            <div
              className={`overflow-hidden transition-all duration-700 ease-in-out ${
                expandedIndex === index ? "max-h-screen" : "max-h-0"
              }`}
            >
              <div className="mt-2 text-sm text-gray-600">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
