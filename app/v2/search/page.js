"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { GiAtom } from "react-icons/gi"; // For search icon
import { RxHamburgerMenu } from "react-icons/rx";
import { FaStar } from "react-icons/fa"; // For favorites
import { FaRegCircleUser } from "react-icons/fa6";
import { FiMap } from "react-icons/fi";
import { CircularProgressbar } from "react-circular-progressbar"; // For relevance indicator
import { RotatingLines } from "react-loader-spinner"; // For modern loader

export default function Home() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalTokensUsed, setTotalTokensUsed] = useState(0);
  const [relevanceFilter, setRelevanceFilter] = useState(0.5); // Relevance filter slider
  const [profiles, setProfiles] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Function to handle form submission and API request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmittedQuery(query);

    try {
      const apiResponse = await axios.post("/api/extract", { query });
      setResponse(apiResponse.data);
      setProfiles(apiResponse.data.profiles || []);
      setTotalTokensUsed(apiResponse.data.totalTokensUsed);
    } catch (error) {
      console.error("Error with API:", error);
    }

    setLoading(false);
  };

  // Function to get relevance indicator based on combined score
  const getRelevanceIndicator = (score) => {
    if (score >= 0.75) {
      return {
        text: "Great Match",
        percentage: 100,
      };
    } else if (score >= 0.5) {
      return {
        text: "Good Match",
        percentage: 60,
      };
    } else {
      return {
        text: "Fair Match",
        percentage: 30,
      };
    }
  };

  const handleToggleFavorite = (profileId) => {
    setUserFavorites((prevFavorites) => {
      if (prevFavorites.includes(profileId)) {
        return prevFavorites.filter((id) => id !== profileId);
      } else {
        return [...prevFavorites, profileId];
      }
    });
  };

  return (
    <div className="w-full h-screen py-8 bg-white font-jakarta px-16">
      {/* Search Bar */}
      <div className="flex justify-between items-center mb-4 ">
        <RxHamburgerMenu className="mx-4" size={28} />
        <div className="w-full md:w-[80%] md:max-w-4xl bg-white/45 md:bg-white/20 border-white rounded-2xl sm:rounded-full z-10">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Technical Co-Founder with AI expertise"
              className="w-full p-2 rounded-lg bg-white border-1 border-black/40 focus:outline-none text-gray-600"
            />
            <button
              onClick={handleSubmit}
              className="w-1/2 sm:mt-0 sm:h-auto sm:w-auto sm:absolute sm:right-0 sm:top-0 sm:bottom-0 group text-xs md:text-base text-white font-semibold px-3 py-2 rounded-lg transition duration-300"
            >
              <GiAtom
                size={28}
                className="group-hover:rotate-90 transition-all duration-250 text-black"
              />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <button className="flex justify-start items-center border-1 border-black/40 gap-3 py-2 px-4 rounded-lg">
            <FiMap />
            San Jose
          </button>
          <button className="rounded-lg">
            <FaRegCircleUser className="" size={32} />
          </button>
        </div>
      </div>
      {response && (
        <div className="flex items-center mt-4 text-gray-500">
          <button
            className="flex items-center gap-3 py-1 px-4 border border-black/60 rounded-full"
            onClick={() => setShowAnalysis(!showAnalysis)}
          >
            {showAnalysis ? (
              <div className="flex items-center gap-2">
                <div className="bg-orange-500 w-3 h-3 rounded-full" />
                <span className="text-sm">Hide Analysis</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-green-500 w-3 h-3 rounded-full" />
                <span className="text-sm">View Analysis</span>
              </div>
            )}
          </button>
          <span className="ml-4">
            {profiles.length} results for &quot;{submittedQuery}&quot;
          </span>
        </div>
      )}

      {showAnalysis && response && (
        <div className="mt-6">
          <pre className="bg-gray-100 p-3 rounded-md whitespace-pre-wrap break-words">
            {response.entities}
          </pre>
        </div>
      )}

      {/* Search Results */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RotatingLines
            strokeColor="gray"
            strokeWidth="5"
            animationDuration="0.75"
            width="56"
            visible={true}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 gap-y-3 mt-8">
          {profiles.map((profile, idx) => {
            const relevance = getRelevanceIndicator(profile.relevancyScore);
            return (
              <div key={idx} className={`p-2 rounded-2xl flex flex-col`}>
                <img
                  // src="/dummy.png"
                  src={profile.profilePicture}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2";
                  }}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-full h-72 object-cover rounded-xl mb-4"
                />
                <h4 className="text-xl font-bold mb-2">
                  {profile.firstName} {profile.lastName}
                </h4>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <FiMap className="mr-1" />
                  {profile.location}
                  <span className="mx-2">•</span>
                  <div className="flex items-center gap-1 w-1/2">
                    <div className="w-4 h-4">
                      <CircularProgressbar
                        value={relevance.percentage}
                        styles={{
                          path: { stroke: `#000000` },
                          trail: { stroke: "#e6e6e6" },
                        }}
                      />
                    </div>
                    <span>{relevance.text}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  {profile.customSummary?.split(" ").slice(0, 18).join(" ") ||
                    "No summary available."}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.strengths?.map((strength, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
