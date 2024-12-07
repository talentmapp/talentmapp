"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircularProgressbar } from "react-circular-progressbar";
import { FaLinkedin } from "react-icons/fa";
import SearchBar from "../../components/SearchBar";

export default function ProfileDetail({ params }) {
  const { id } = params;
  const router = useRouter();

  // States for the search bar
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [profile, setProfile] = useState(null);

  // States for relevance data
  const [relevanceText, setRelevanceText] = useState("");
  const [relevancePercentage, setRelevancePercentage] = useState(0);

  // New states for strongest requirements and unmet requirements
  const [strongestRequirements, setStrongestRequirements] = useState("");
  const [unmetRequirements, setUnmetRequirements] = useState("");

  useEffect(() => {
    // Retrieve relevance and requirements data from sessionStorage
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
      try {
        const response = await fetch(`/api/profile/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setProfile(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [id]);

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

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-screen py-8 bg-white font-jakarta px-28">
      {/* Same Search Bar at the top */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        handleSubmit={handleSubmit}
      />

      <div className="flex justify-between items-center mt-16 ml-6">
        <button
          className="text-gray-600 hover:underline"
          onClick={() => router.back()}
        >
          Back to Results
        </button>
      </div>
      <div className="w-full flex gap-28">
        {/* Profile Sidebar */}
        <div className="w-1/3">
          <div className="p-6 rounded-xl">
            <img
              src="/dummy.png"
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
                    value={relevancePercentage}
                    styles={{
                      path: { stroke: `#000000` },
                      trail: { stroke: "#e6e6e6" },
                    }}
                  />
                </div>
                <span className="text-base font-medium">{relevanceText}</span>
              </div>
            </div>
            <div className="w-full flex gap-5 mt-5">
              <button className="w-full py-3 px-6 text-sm bg-black text-white rounded-md flex justify-center items-center">
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
            <div className="flex flex-wrap gap-2 mb-4 w-full">
              {profile.strengths?.map((strength, i) => (
                <span key={i}>
                  {i > 0 && "• "}
                  {strength}
                </span>
              ))}
            </div>
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
        </div>
      </div>
    </div>
  );
}
