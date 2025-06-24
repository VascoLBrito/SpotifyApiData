"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";

import WrappedSection from "@/components/Wrapped";
import SpotifyDetailPanel from "@/components/DetailPannel";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isShrunk, setIsShrunk] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<any | null>(null);

  const [userTopArtists, setUserTopArtists] = useState([]);
  const [userTopTracks, setUserTopTracks] = useState([]);
  const [userTopGenres, setUserTopGenres] = useState([]);

  const [userAccessToken, setUserAccessToken] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("");

  const [wrappedLoading, setWrappedLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const fetchWrapped = async (range = timeRange) => {
    if (!userAccessToken || wrappedLoading) return;

    setWrappedLoading(true);
    try {
      const res = await fetch("/api/wrapped", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: userAccessToken,
          time_range: range,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ Failed to fetch wrapped:", errorData);
        return;
      }

      const data = await res.json();
      setUserTopArtists(data.topArtists);
      setUserTopTracks(data.topTracks);
      setUserTopGenres(data.topGenres);
    } catch (err) {
      console.error("❌ Network error:", err);
    }
    setWrappedLoading(false);
  };

  const handleItemClick = (
    id: string,
    imageUrl: string,
    type: "track" | "artist"
  ) => {
    setSelectedTrackId(id);
    setSelectedTrack({ album_cover_url: imageUrl }); // ou só passar imageUrl diretamente
    setIsShrunk(false);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range); // por exemplo, e depois refaz o fetch do wrapped com esse valor
  };

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    const localToken = localStorage.getItem("spotify_access_token");

    if (urlToken) {
      setUserAccessToken(urlToken);
      localStorage.setItem("spotify_access_token", urlToken);
      setTimeRange("long_term");
    } else if (localToken) {
      setUserAccessToken(localToken);
      setTimeRange("long_term");
    }

    setAuthChecked(true); // <- isto garante que já verificámos o token
  }, []);

  useEffect(() => {
    const fetchTokenAndWrapped = async () => {
      try {
        const res = await fetch("/api/auth/token");
        if (!res.ok) return;

        const data = await res.json();
        if (data.access_token) {
          setUserAccessToken(data.access_token);
          setTimeRange("long_term"); // or let user pick it
        }
      } catch (err) {
        console.error("❌ Failed to get token from cookie:", err);
      }
    };

    fetchTokenAndWrapped();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout");
      window.location.href = "/";
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
  };

  useEffect(() => {
    if (userAccessToken && timeRange) {
      fetchWrapped(timeRange);
    }
  }, [timeRange, userAccessToken]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsShrunk(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="mt-12 p-6">
      {!userAccessToken && (
        <div className="grid gap-12 h-screen overflow-hidden">
          <div className="text-white text-center max-w-3xl mx-auto mt-20 px-4">
            <h2 className="text-3xl font-bold mb-4">
              Welcome to Spotify Wrapped Explorer 🎧
            </h2>
            <p className="text-lg text-gray-300">
              This app gives you a personalized snapshot of your Spotify
              listening habits. You’ll see your top tracks, artists, and
              favorite genres — based on your selected time range.
            </p>
            <p className="text-md text-gray-400 mt-4">
              Choose a time range from the dropdown menu above — whether it’s
              your recent month, last 6 months, or all-time favorites. Let's
              Start
            </p>
            <p className="text-md text-gray-500 mt-6 italic">
              Note: You must be logged in with Spotify to access your listening
              data.
            </p>
          </div>

          <div className="w-auto m-auto bg-amber-200">
            <a
              href="/api/auth/login"
              className="bg-slate-500 rounded-md p-4 hover:bg-slate-300 hover:text-black transition-all cursor-pointer"
            >
              LOGIN{" "}
            </a>
          </div>
        </div>
      )}
      {userAccessToken && (
        <div className="min-h-screen">
          {wrappedLoading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <Spinner />
            </div>
          ) : (
            <>
              <WrappedSection
                topArtists={userTopArtists}
                topTracks={userTopTracks}
                topGenres={userTopGenres}
                onItemClick={handleItemClick}
                onTimeRangeChange={handleTimeRangeChange}
                timeRange={timeRange}
              />

              <SpotifyDetailPanel
                embedId={selectedTrackId}
                imageUrl={selectedTrack?.album_cover_url || "/fallback.png"}
                isOpen={!isShrunk}
                onClose={() => setIsShrunk(true)}
                type="track"
              />
            </>
          )}
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
