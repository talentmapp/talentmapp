"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircularProgressbar } from "react-circular-progressbar";
import { FaLinkedin } from "react-icons/fa";
import { FiMap } from "react-icons/fi";
import SearchBar from "../../components/SearchBar";
import SearchResults from "../../components/SearchResults";

function getRelevanceIndicator(score) {
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
}

export default function ProfileDetail({ params }) {
  const { id } = params;
  const router = useRouter();

  // States for the search bar and results
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Profile details
  const [profile, setProfile] = useState(null);

  // Relevance and requirements
  const [relevanceText, setRelevanceText] = useState("");
  const [relevancePercentage, setRelevancePercentage] = useState(0);
  const [strongestRequirements, setStrongestRequirements] = useState("");
  const [unmetRequirements, setUnmetRequirements] = useState("");

  // Similar profiles
  const [similarProfiles, setSimilarProfiles] = useState([]);

  useEffect(() => {
    const storedRelevanceText = sessionStorage.getItem("relevanceText");
    const storedRelevancePercentage = sessionStorage.getItem(
      "relevancePercentage",
    );
    const storedStrongestRequirements = sessionStorage.getItem(
      "strongestRequirements",
    );
    const storedUnmetRequirements = sessionStorage.getItem("unmetRequirements");

    if (storedRelevanceText) setRelevanceText(storedRelevanceText);
    if (storedRelevancePercentage)
      setRelevancePercentage(parseInt(storedRelevancePercentage, 10));
    if (storedStrongestRequirements)
      setStrongestRequirements(storedStrongestRequirements);
    if (storedUnmetRequirements) setUnmetRequirements(storedUnmetRequirements);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (submittedQuery) return; // If searching, skip fetching profile details
      try {
        const resp = await fetch(`/api/profile/${id}`);
        if (!resp.ok) throw new Error("Failed to fetch profile");
        const data = await resp.json();
        setProfile(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [id, submittedQuery]);

  useEffect(() => {
    const fetchSimilarProfiles = async () => {
      if (!profile || !profile._id || submittedQuery) return;
      try {
        const resp = await fetch(`/api/similarProfiles?id=${profile._id}`);
        if (!resp.ok) throw new Error("Failed to fetch similar profiles");
        const data = await resp.json();
        setSimilarProfiles(data.similarProfiles || []);
      } catch (error) {
        console.error("Error fetching similar profiles:", error);
      }
    };
    fetchSimilarProfiles();
  }, [profile, submittedQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmittedQuery(query);

    try {
      const apiResponse = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const result = await apiResponse.json();
      setResponse(result);
      setProfiles(result.profiles || []);
    } catch (error) {
      console.error("Error with API:", error);
    }

    setLoading(false);
  };

  const handleProfileClick = (selectedProfile, relevance) => {
    sessionStorage.setItem("relevanceText", relevance.text);
    sessionStorage.setItem(
      "relevancePercentage",
      relevance.percentage.toString(),
    );
    sessionStorage.setItem(
      "strongestRequirements",
      selectedProfile.strongestMatches || "None",
    );
    sessionStorage.setItem(
      "unmetRequirements",
      selectedProfile.unmetRequirements || "None",
    );
    router.push(`/profile/${selectedProfile._id}`);
  };

  // If a search is in progress or submitted, show search results
  if (submittedQuery) {
    return (
      <div className="w-full h-screen py-8 bg-white font-jakarta px-28 overflow-y-auto">
        <SearchBar
          query={query}
          setQuery={setQuery}
          handleSubmit={handleSubmit}
        />
        <SearchResults
          profiles={profiles}
          response={response}
          submittedQuery={submittedQuery}
          loading={loading}
          onProfileClick={handleProfileClick}
        />
      </div>
    );
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  // Normal profile detail view if no search is active
  const relevance = { text: relevanceText, percentage: relevancePercentage };

  return (
    <div className="w-full h-screen py-8 bg-white font-jakarta overflow-y-auto">
      <div className="px-28">
        <SearchBar
          query={query}
          setQuery={setQuery}
          handleSubmit={handleSubmit}
        />
      </div>

      <div className="flex justify-between items-center mt-16 ml-6 px-28">
        <button
          className="text-gray-600 hover:underline"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
      <div className="w-full">
        <div className="flex gap-28 px-28">
          {/* Profile Sidebar */}
          <div className="w-1/3">
            <div className="p-6 rounded-xl">
              <img
                src={profile.profilePicture}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2";
                }}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-full h-80 object-cover rounded-xl"
              />
              <h2 className="text-3xl font-bold mt-4">
                {profile.firstName} {profile.lastName}
              </h2>
              {/* Relevancy Section */}
              <div className="w-full flex gap-5 items-center mt-4">
                <div className="flex gap-2">
                  <div className="w-6 h-6">
                    <img src="/eldenring.png" />
                  </div>
                  <span className="text-base font-medium">he/him</span>
                </div>
                <span className="">•</span>
                <div className="flex gap-2">
                  <div className="w-6 h-6">
                    <CircularProgressbar
                      value={relevance.percentage}
                      styles={{
                        path: { stroke: `#000000` },
                        trail: { stroke: "#e6e6e6" },
                      }}
                    />
                  </div>
                  <span className="text-base font-medium">
                    {relevance.text}
                  </span>
                </div>
              </div>
              <div className="w-full flex gap-5 mt-5">
                <button
                  className="w-full py-3 px-6 text-sm bg-black text-white rounded-md flex justify-center items-center"
                  onClick={() => {
                    if (profile?.socialMedia?.LinkedIn) {
                      const linkedInUrl = `https://linkedin.com/in/${profile.socialMedia.LinkedIn}`;
                      window.open(linkedInUrl, "_blank");
                    }
                  }}
                >
                  Connect on{" "}
                  <FaLinkedin className="text-white text-lg ml-1.5 mt-0.5" />
                </button>

                <button className="w-full py-3 px-6 text-sm border-black border-2 text-black rounded-md flex justify-center items-center">
                  Save to List <img src="/upndown.png" className="h-3.5 ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Main Content */}
          <div className="font-jakarta w-1/2 p-6">
            <div>
              <h3 className="text-3xl font-medium mb-4">
                About {profile.firstName}
              </h3>
              <p className="text-gray-600">
                {profile.customSummary || "No summary available."}
              </p>
            </div>
            <div className="mt-10">
              <h3 className="text-3xl font-medium mb-4">Skills</h3>
              {profile.strengths && profile.strengths.length >= 5 && (
                <div className="flex flex-col gap-y-2 mb-4 w-full text-gray-700 text-sm">
                  {/* Top line: 3 skills, dots in between, no trailing dot */}
                  <div className="flex items-center">
                    {profile.strengths.slice(0, 3).map((skill, i, arr) => (
                      <div key={i} className="flex items-center">
                        <span>{skill}</span>
                        {i < arr.length - 1 && <span className="mx-2">•</span>}
                      </div>
                    ))}
                  </div>

                  {/* Second line: 2 skills with one dot between, no trailing dot */}
                  <div className="flex items-center">
                    {profile.strengths.slice(3, 5).map((skill, i, arr) => (
                      <div key={i} className="flex items-center">
                        <span>{skill}</span>
                        {i < arr.length - 1 && <span className="mx-2">•</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-3xl font-medium mb-4 mt-10">Reason</h3>
              <p className="text-gray-600">{profile.customSummary}</p>
            </div>

            {/* Additional Sections for Strongest Requirements and Unmet Requirements */}
            <div className="mt-10">
              <h3 className="text-3xl font-medium mb-4">
                Strongest Requirements
              </h3>
              <p className="text-gray-600">{strongestRequirements}</p>
            </div>

            <div className="mt-10">
              <h3 className="text-3xl font-medium mb-4">Unmet Requirements</h3>
              <p className="text-gray-600">{unmetRequirements}</p>
            </div>
            <div className="w-full h-[2px] my-10 rounded-full bg-black/30" />
          </div>
        </div>

        {/* Similar Profiles Section */}
        {similarProfiles.length > 0 && (
          <div className="mt-10 px-14">
            <h2 className="text-3xl font-medium font-jakarta mt-24 mb-6 w-1/3">
              Similar profiles you might be interested in
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {similarProfiles.map((simProfile, idx) => {
                const simRelevance = getRelevanceIndicator(
                  simProfile.relevancyScore,
                );
                return (
                  <div
                    key={idx}
                    className="p-2 rounded-2xl flex flex-col cursor-pointer"
                    onClick={() => handleProfileClick(simProfile, simRelevance)}
                  >
                    <img
                      src={simProfile.profilePicture}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2";
                      }}
                      alt={`${simProfile.firstName} ${simProfile.lastName}`}
                      className="w-full h-72 object-cover rounded-xl mb-4"
                    />
                    <h4 className="text-xl font-bold mb-2">
                      {simProfile.firstName} {simProfile.lastName}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <FiMap className="mr-1" />
                      {simProfile.location
                        ? simProfile.location
                        : "Unavailable"}
                      <span className="mx-2">•</span>
                      <div className="flex items-center gap-1 w-1/2">
                        <div className="w-4 h-4">
                          <CircularProgressbar
                            value={simRelevance.percentage}
                            styles={{
                              path: { stroke: `#000000` },
                              trail: { stroke: "#e6e6e6" },
                            }}
                          />
                        </div>
                        <span>{simRelevance.text}</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      {simProfile.customSummary
                        ?.split(" ")
                        .slice(0, 18)
                        .join(" ") || "No summary available."}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4 w-full">
                      <div className="text-gray-700 text-[0.8rem] font-medium">
                        <div className="flex justify-around items-center">
                          <span>{simProfile.strengths?.[0]}</span>
                          {simProfile.strengths?.[1] && (
                            <span className="mx-3">•</span>
                          )}
                          <span>{simProfile.strengths?.[1]}</span>
                        </div>
                        {simProfile.strengths?.[2] && (
                          <div className="mt-2">
                            <span>{simProfile.strengths?.[2]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
