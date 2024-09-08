"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalTokensUsed, setTotalTokensUsed] = useState(0);
  const [relevanceFilter, setRelevanceFilter] = useState(0.5); // Relevance filter slider

  // Function to handle form submission and API request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiResponse = await axios.post("/api/extract", { query });
      setResponse(apiResponse.data);
      setTotalTokensUsed(apiResponse.data.totalTokensUsed);
    } catch (error) {
      console.error("Error with API:", error);
    }

    setLoading(false);
  };

  // Function to get border color based on combined score
  const getBorderColor = (score) => {
    if (score >= 0.75) return "border-green-500"; // High relevance
    if (score >= 0.5) return "border-yellow-500"; // Medium relevance
    return "border-red-500"; // Low relevance
  };

  return (
    <div className="flex font-jakarta items-center justify-center bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 my-20 mx-24 w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Entity Extractor
        </h1>
        <form onSubmit={handleSubmit}>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query..."
            className="w-full p-3 border border-gray-300 rounded-md mb-4"
            rows="5"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            {loading ? "Processing..." : "Analyze Query"}
          </button>
        </form>

        {/* Relevancy filter slider */}
        <div className="mt-4">
          <label htmlFor="relevanceSlider" className="block mb-2 text-sm">
            Relevance Filter ({relevanceFilter})
          </label>
          <input
            type="range"
            id="relevanceSlider"
            name="relevanceSlider"
            min="0"
            max="1"
            step="0.05"
            value={relevanceFilter}
            onChange={(e) => setRelevanceFilter(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {response && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Extracted Information</h2>
            <div className="mt-4 text-sm text-gray-600">
              <strong>Total Tokens Used:</strong> {totalTokensUsed}
            </div>
            <pre className="bg-gray-100 p-3 rounded-md whitespace-pre-wrap break-words">
              {response.entities}
            </pre>

            <h2 className="text-xl font-bold mt-4 mb-2">Suggested Queries</h2>
            <ul className="list-disc ml-5">
              {response.suggestions.map((suggestion, index) => (
                <li key={index} className="mb-2">
                  {suggestion}
                </li>
              ))}
            </ul>

            {/* Display profiles */}
            <h2 className="text-xl font-bold mt-4 mb-2">Matching Profiles</h2>
            <div>
              {response.profiles
                .filter((profile) => profile.combinedScore >= relevanceFilter)
                .map((profile, index) => (
                  <div
                    key={index}
                    className={`p-6 mb-6 rounded-xl shadow-md border-4 ${getBorderColor(
                      profile.combinedScore,
                    )} bg-white`}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={profile.profilePicture}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2";
                        }}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <h3 className="text-xl font-bold">
                          {profile.firstName} {profile.lastName}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {profile.location || "Location not available"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p>
                        <strong className="text-lg">Summary:</strong>{" "}
                        <span className="text-gray-700">
                          {profile.customSummary}
                        </span>
                      </p>

                      <p>
                        <strong className="text-lg">Skills:</strong>{" "}
                        <span className="text-gray-700">
                          {profile.strengths?.join(", ") || "Not available"}
                        </span>
                      </p>

                      <p>
                        <strong className="text-lg">Experience:</strong>{" "}
                        <span className="text-gray-700">
                          {profile.experience
                            ?.map((exp) => `${exp.title} at ${exp.company}`)
                            .join(", ") || "Not available"}
                        </span>
                      </p>

                      <p>
                        <strong className="text-lg">Education:</strong>{" "}
                        <span className="text-gray-700">
                          {profile.education
                            ?.map(
                              (edu) => `${edu.degree} from ${edu.university}`,
                            )
                            .join(", ") || "Not available"}
                        </span>
                      </p>

                      <p>
                        <strong className="text-lg">Reason:</strong>{" "}
                        <span className="text-gray-700">{profile.reason}</span>
                      </p>

                      <p>
                        <strong className="text-lg">
                          Strongest Requirement Match(es):
                        </strong>{" "}
                        <span className="text-gray-700">
                          {profile.strongestMatches}
                        </span>
                      </p>

                      <p>
                        <strong className="text-lg">Relevance Score:</strong>{" "}
                        <span className="text-gray-700">
                          {profile.combinedScore.toFixed(2)}
                        </span>
                      </p>

                      <div>
                        <h4 className="font-bold text-red-500">
                          Unmet Requirements:
                        </h4>
                        <p>{profile.unmetRequirements}</p>
                      </div>

                      <div className="flex items-center space-x-2 py-4">
                        <span className="font-bold mr-2">
                          Find {profile.firstName} on:{" "}
                        </span>
                        <a
                          href={`https://www.linkedin.com/in/${profile.socialMedia.LinkedIn}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline p-2 bg-slate-300 rounded-full hover:bg-slate-500"
                        >
                          <img
                            src="ai_search/linkedin.png"
                            alt="LinkedIn"
                            className="w-6 h-6"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// i'm trying to start an agritech copmany where we provide pesticide bottles designed specifically to latch on to drones. Can you help me find a prodct designer who can both design the website for this company, do the branding and identity, and most importantly - design the pesticide bottles?
