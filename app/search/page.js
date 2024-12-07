"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FiMap } from "react-icons/fi";
import { CircularProgressbar } from "react-circular-progressbar";
import { RotatingLines } from "react-loader-spinner";
import SearchBar from "../components/SearchBar"; // Import the new shared component

export default function Home() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalTokensUsed, setTotalTokensUsed] = useState(0);
  const [relevanceFilter, setRelevanceFilter] = useState(0.5);
  const [profiles, setProfiles] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const router = useRouter();
  console.log(profiles[0]);

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

  const handleProfileClick = (profile, relevance) => {
    // Store relevance data
    sessionStorage.setItem("relevanceText", relevance.text);
    sessionStorage.setItem(
      "relevancePercentage",
      relevance.percentage.toString(),
    );

    // Store strongest requirements and unmet requirements from the selected profile
    // If these properties are not defined, default to "None"
    sessionStorage.setItem(
      "strongestRequirements",
      profile.strongestMatches || "None",
    );
    sessionStorage.setItem(
      "unmetRequirements",
      profile.unmetRequirements || "None",
    );

    // Navigate without URL parameters
    router.push(`/profile/${profile._id}`);
  };
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
      {/* Reusable Search Bar */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        handleSubmit={handleSubmit}
      />

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
              <div
                key={idx}
                className="p-2 rounded-2xl flex flex-col cursor-pointer"
                onClick={() => handleProfileClick(profile, relevance)}
              >
                <img
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
                  {profile.location ? profile.location : "Unavailable"}
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
                <p className="text-gray-500 text-sm mb-4">
                  {profile.customSummary?.split(" ").slice(0, 18).join(" ") ||
                    "No summary available."}
                </p>
                <div className="flex flex-wrap gap-2 mb-4 w-full">
                  <div className="text-gray-700 text-[0.8rem] font-medium">
                    <div className="flex justify-around items-center">
                      <span>{profile.strengths?.[0]}</span>
                      {profile.strengths?.[1] && (
                        <span className="mx-3">•</span>
                      )}
                      <span>{profile.strengths?.[1]}</span>
                    </div>
                    {profile.strengths?.[2] && (
                      <div className="mt-2">
                        <span>{profile.strengths?.[2]}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
