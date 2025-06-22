"use client";

import React from "react";

type SpotifyDetailPanelProps = {
  embedId: string | null; // track or artist ID
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  type?: "track" | "artist";
};

export default function SpotifyDetailPanel({
  embedId,
  imageUrl,
  isOpen,
  onClose,
  type = "track",
}: SpotifyDetailPanelProps) {
  return (
    <div
      className={`z-10 fixed bottom-0 left-0 w-screen bg-black transition-all duration-500 overflow-hidden transform ${
        isOpen ? "translate-y-0 h-[8rem]" : "translate-y-full h-0"
      }`}
    >
      <div className="text-white w-full h-full flex justify-center items-center">
        {embedId ? (
          <iframe
            src={`https://open.spotify.com/embed/${type}/${embedId}`}
            width="90%"
            height="100%"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded shadow-lg -mb-12"
          ></iframe>
        ) : null}
      </div>

      {isOpen && (
        <button
          className="absolute top-[2%] right-[2%] aspect-square text-white bg-black rounded-full p-2 hover:bg-slate-300 hover:text-black transition-all"
          onClick={onClose}
        >
          <p>V</p>
        </button>
      )}
    </div>
  );
}
