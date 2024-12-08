"use client";
import { useState } from "react";
import { FiMap } from "react-icons/fi";
import { RotatingLines } from "react-loader-spinner";
import { CircularProgressbar } from "react-circular-progressbar";

// Expect a getRelevanceIndicator function from the parent or place it here.
// For convenience, inline here:
function getRelevanceIndicator(score) {
  if (score >= 0.75) {
    return { text: "Great Match", percentage: 100 };
  } else if (score >= 0.5) {
    return { text: "Good Match", percentage: 60 };
  } else {
    return { text: "Fair Match", percentage: 30 };
  }
}

export default function SearchResults({
  profiles,
  response,
  submittedQuery,
  loading,
  onProfileClick,
}) {
  const [showAnalysis, setShowAnalysis] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RotatingLines
          strokeColor="gray"
          strokeWidth="3"
          animationDuration="0.75"
          width="56"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div>
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

      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 gap-y-5 mt-8">
          {profiles.map((profile, idx) => {
            const relevance = getRelevanceIndicator(profile.relevancyScore);
            return (
              <div
                key={idx}
                className="p-2 rounded-2xl flex flex-col cursor-pointer"
                onClick={() => onProfileClick(profile, relevance)}
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
      ) : (
        <div className="mt-8 text-gray-600 text-center">
          No results found for &quot;{submittedQuery}&quot;.
        </div>
      )}
    </div>
  );
}
