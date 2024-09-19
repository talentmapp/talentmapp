import React from "react";

export default function InfoSection() {
  // Array of card data
  const cardsData = [
    {
      id: 1,
      image: "/card1.png",
      number: "01",
      title: "NLP Based Discovery Engine",
      description:
        "Discover professionals and opportunities tailored to your needs with our AI-powered search. Get precise, relevant results that elevate your networking and career growth.",
      borderGradient: "from-transparent to-purple-800",
      shadowColor: "shadow-violet-500/10",
    },
    {
      id: 2,
      image: "/card2.png",
      number: "02",
      title: "AI-Powered Networking",
      description:
        "Our AI-powered platform connects you with the most relevant professionals and opportunities, helping you grow your network efficiently.",
      borderGradient: "from-green-300 via-blue-300 to-indigo-300",
      shadowColor: "shadow-cyan-700/10",
    },
    {
      id: 3,
      image: "/card3.png",
      number: "03",
      title: "Insightful Analytics",
      description:
        "Gain insights into your networking patterns and discover new strategies for career growth through our in-depth analytics.",
      borderGradient: "from-pink-300 via-red-300 to-yellow-300",
      shadowColor: "shadow-orange-700/10",
    },
  ];

  return (
    <section className="w-full flex flex-col justify-center px-24 pt-64 text-center font-jakarta">
      {/* Title and subtitle */}
      <div className="mb-12 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          What&apos;s in it for you?
        </h2>
        <p className="text-lg md:text-xl w-1/2 mt-3 text-gray-600">
          Finding the right talent to connect with for your dream network or
          next big project has never been easier.
        </p>
      </div>

      {/* Cards container */}
      <div className="flex flex-col md:flex-row text-left justify-center gap-8 px-4 md:px-0">
        {cardsData.map((card) => (
          <div
            key={card.id}
            className={`relative ${card.shadowColor} bg-white rounded-2xl shadow-lg w-full md:w-1/3 overflow-hidden flex flex-col`}
          >
            {/* Gradient Border */}
            <div
              className={`absolute inset-0 rounded-2xl p-0.5 bg-gradient-to-br ${card.borderGradient} pointer-events-none`}
            ></div>

            {/* Inner Card Content */}
            <div className="relative z-10 rounded-2xl bg-white flex flex-col h-full">
              {/* Image Section */}
              <div className="relative h-48 rounded-t-2xl overflow-hidden">
                <img
                  src={card.image}
                  alt={`Card ${card.number} Background`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 text-white text-2xl font-light">
                  {card.number}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-gray-600">{card.description}</p>
                </div>
              </div>
            </div>

            {/* Soft Shadow */}
            <div
              className={`absolute inset-0 rounded-2xl ${card.shadowColor} opacity-20 pointer-events-none`}
            ></div>
          </div>
        ))}
      </div>
    </section>
  );
}
