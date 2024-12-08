"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import { RotatingLines } from "react-loader-spinner";

export default function Home() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [profiles, setProfiles] = useState([]);

  const [limit, setLimit] = useState(12);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Separate loading states
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (initialQuery && initialQuery.trim().length > 0) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmittedQuery(query);
    setOffset(0);
    setLimit(12);
    setHasMore(false);

    // Show initial loading
    setLoadingInitial(true);
    setLoadingMore(false);

    try {
      const apiResponse = await axios.post("/api/extract", {
        query,
        limit: 12,
        offset: 0,
      });
      setResponse(apiResponse.data);
      setProfiles(apiResponse.data.profiles || []);
      setHasMore((apiResponse.data.profiles || []).length === 12);
    } catch (error) {
      console.error("Error with API:", error);
      setProfiles([]);
      setHasMore(false);
    }

    setLoadingInitial(false);
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);

    const newOffset = offset + (offset === 0 ? 12 : 8);
    const nextLimit = offset === 0 ? 8 : 8;

    try {
      const apiResponse = await axios.post("/api/extract", {
        query,
        limit: nextLimit,
        offset: newOffset,
      });
      const newProfiles = apiResponse.data.profiles || [];
      setProfiles((prev) => [...prev, ...newProfiles]);
      setHasMore(newProfiles.length === nextLimit);
      setOffset(newOffset);
    } catch (error) {
      console.error("Error fetching more profiles:", error);
      setHasMore(false);
    }

    setLoadingMore(false);
  };

  useEffect(() => {
    if (!submittedQuery) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 1.0 },
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore, profiles]);

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
    router.push(`/profile/${profile._id}`);
  };

  return (
    <div className="w-full h-screen py-8 bg-white font-jakarta px-16 overflow-auto">
      <SearchBar
        query={query}
        setQuery={setQuery}
        handleSubmit={handleSubmit}
        loading={loadingInitial}
      />

      {/* If user has submitted a search */}
      {submittedQuery && (
        <>
          {/* Pass loadingInitial to SearchResults so it can show a large loader initially */}
          <SearchResults
            profiles={profiles}
            response={response}
            submittedQuery={submittedQuery}
            loading={loadingInitial}
            onProfileClick={handleProfileClick}
          />

          {/* For loadMore, show a small spinner at the bottom */}
          {hasMore && (
            <div
              ref={observerRef}
              className="h-10 flex justify-center items-center"
            >
              {loadingMore && (
                <div className="flex justify-center items-center h-64 mt-44">
                  <RotatingLines
                    strokeColor="gray"
                    strokeWidth="3"
                    animationDuration="0.75"
                    width="48"
                    visible={true}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
