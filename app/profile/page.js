/* eslint-disable @next/next/no-img-element */
"use client";

import { Fieldset, Input, Legend } from "@headlessui/react";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function Profile() {
  const { data: session, status } = useSession();
  const loadingSession = status === "loading";

  const [linkedinUsername, setLinkedinUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false); // New state to toggle between profile generation and favorites
  const [favoriteProfiles, setFavoriteProfiles] = useState([]); // Full profile data for favorite profiles
  const [loadingFavorites, setLoadingFavorites] = useState(false); // Loading state for fetching favorites

  // Fetch user's favorites from the API
  const fetchFavorites = async () => {
    setLoadingFavorites(true); // Start loading spinner
    if (session?.user?.email) {
      try {
        // Fetch the user's favorite profile IDs
        const response = await axios.get("/api/favorites", {
          params: { email: session.user.email },
        });
        const favoriteIds = response.data.favorites || [];

        if (favoriteIds.length > 0) {
          // Now fetch the full profile data for the favorite profiles
          const profilesResponse = await axios.post("/api/get-profiles", {
            profileIds: favoriteIds, // Send the IDs to fetch full profiles
          });
          setFavoriteProfiles(profilesResponse.data.profiles || []);
        } else {
          setFavoriteProfiles([]);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoadingFavorites(false); // Stop loading spinner
      }
    }
  };

  useEffect(() => {
    if (showFavorites) {
      fetchFavorites();
    }
  }, [showFavorites]);

  // Handler for generating the profile based on LinkedIn URL
  const handleGenerateProfile = async () => {
    setLoading(true); // Start loading spinner
    setMessage(""); // Clear any previous messages
    try {
      // Use vanityName from the session instead of an input field
      const vanityName = session?.user?.vanityName;
      const linkedinProfilePicture = session?.user?.image;

      if (!vanityName) {
        setMessage("Unable to retrieve your LinkedIn vanity name.");
        setLoading(false);
        return;
      }

      const linkedinUrl = `https://www.linkedin.com/in/${vanityName}`;

      const response = await axios.post("/api/generateProfile", {
        linkedinUrl,
        userEmail: session?.user?.email,
        linkedinProfilePicture,
      });

      if (response.data.success) {
        setMessage("Profile generated successfully!");
      } else {
        setMessage("Failed to generate profile. Please try again.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error ===
          "You can only generate your profile once a week."
      ) {
        setMessage("You can only generate your profile once a week.");
      } else {
        setMessage("An error occurred while generating the profile.");
      }
      console.error("Profile generation error:", error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="h-screen w-full flex flex-col mt-32 items-center">
      <span></span>
      <div className="w-[20rem] rounded-full h-[20rem] bg-[#5013AF] z-10 absolute blur-3xl opacity-15 left-36 bottom-16" />
      <div className="w-[25rem] rounded-full h-[30rem] bg-cyan-700 z-10 absolute blur-3xl opacity-10 right-44 bottom-50" />
      <div className="z-50 w-full rounded-md">
        <div className="flex mx-56 gap-3 justify-start">
          <a
            href="/"
            className="text-gray-400 text-center bg-white/10 rounded-md w-[12%] p-2 hover:text-gray-200 hover:bg-slate-600 transition text-xs"
          >
            {" "}
            Back to Search
          </a>
          {/* Button to toggle between Profile and Favorites */}
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="text-gray-400 bg-white/20 w-[15%] rounded-md p-2 hover:text-gray-200 hover:bg-purple-600/20 transition text-xs"
          >
            {showFavorites ? "Profile" : "Favorites"}
          </button>
        </div>

        {!showFavorites ? (
          <Fieldset className="space-y-6 mx-56 rounded-xl bg-white/5 mt-5 sm:p-10">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <Legend className="text-3xl font-semibold text-white">
                  Account Details
                </Legend>
                <span className="w-[90%] text-sm text-neutral-500/80 font-light mt-2">
                  Populate profile with data from your LinkedIn account.
                </span>
              </div>
              {!loadingSession && session?.user ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="rounded-full w-[1/2] h-[1/2] mx-5 cursor-pointer border-3 border-dotted border-gray-600 p-1.5"
                  tabIndex="0"
                />
              ) : (
                ""
              )}
            </div>
            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex flex-col items-start w-full mx-12">
                <label className="text-sm/6 font-medium text-white">Name</label>
                <Input
                  className={clsx(
                    "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                  )}
                  placeholder={session?.user?.name}
                />
              </div>
              <button
                className="py-2 w-[30%] mt-12 text-sm bg-gray-700 hover:bg-[#5013AF] bg-opacity-40 hover:bg-opacity-60 transition text-white rounded-md"
                onClick={handleGenerateProfile}
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white inline-block"></span>
                ) : (
                  "Generate Profile"
                )}
              </button>
              {message && (
                <p className="text-sm text-white mt-5 text-center">{message}</p>
              )}
            </div>
          </Fieldset>
        ) : (
          <Fieldset className="space-y-6 mx-56 rounded-xl bg-white/5 mt-5 sm:p-10">
            <Legend className="text-3xl font-semibold text-white">
              Your People
            </Legend>
            {loadingFavorites ? (
              <div className="text-center text-gray-400">
                <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-white inline-block"></span>
              </div>
            ) : favoriteProfiles.length === 0 ? (
              <div className="text-center text-gray-400">
                No profiles favorited yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {favoriteProfiles.map((profile, idx) => (
                  <div
                    key={idx}
                    className="relative bg-gray-800 p-4 rounded-lg shadow-md"
                  >
                    <div className="flex justify-between">
                      <img
                        src={profile.profilePicture}
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.src =
                            "https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2";
                        }}
                        alt={profile.firstName}
                        className="w-16 h-16 rounded-full"
                      />
                      <a
                        href={`https://www.linkedin.com/in/${profile.socialMedia.LinkedIn}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-105 w-8"
                      >
                        <img
                          src="ai_search/linkedin.png"
                          alt="LinkedIn"
                          className="w-full h-auto"
                        />
                      </a>
                    </div>
                    <h4 className="text-lg font-semibold text-white mt-2">
                      {profile.firstName} {profile.lastName}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {profile.location || "Location not available"}
                    </p>
                    <div className="gap-2 mt-2 space-y-2">
                      {profile.strengths.map((interest, index) => (
                        <span
                          key={index}
                          className="inline-block justify-start bg-[#5013AF]/50 text-white px-3 mr-1 py-1 rounded-full text-xs font-light"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Fieldset>
        )}
      </div>
    </div>
  );
}
