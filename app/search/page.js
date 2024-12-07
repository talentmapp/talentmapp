"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";

export default function Home() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);

  const router = useRouter();

  useEffect(() => {
    // If there's a query in the URL, submit it automatically on mount
    if (initialQuery && initialQuery.trim().length > 0) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSubmittedQuery(query);

    try {
      const apiResponse = await axios.post("/api/extract", { query });
      setResponse(apiResponse.data);
      setProfiles(apiResponse.data.profiles || []);
    } catch (error) {
      console.error("Error with API:", error);
    }

    setLoading(false);
  };

  const handleProfileClick = (profile, relevance) => {
    sessionStorage.setItem("relevanceText", relevance.text);
    sessionStorage.setItem(
      "relevancePercentage",
      relevance.percentage.toString(),
    );
    sessionStorage.setItem(
      "strongestRequirements",
      profile.strongestMatches || "None",
    );
    sessionStorage.setItem(
      "unmetRequirements",
      profile.unmetRequirements || "None",
    );
    // Navigate to profile details, adjust route if necessary
    router.push(`/profile/${profile._id}`);
  };

  return (
    <div className="w-full h-screen py-8 bg-white font-jakarta px-16">
      <SearchBar
        query={query}
        setQuery={setQuery}
        handleSubmit={handleSubmit}
      />

      {/* If user has submitted a search or came with a q param, show results */}
      {submittedQuery && (
        <SearchResults
          profiles={profiles}
          response={response}
          submittedQuery={submittedQuery}
          loading={loading}
          onProfileClick={handleProfileClick}
        />
      )}
    </div>
  );
}
