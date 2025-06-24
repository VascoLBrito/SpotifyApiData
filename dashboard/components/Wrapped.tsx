import React, { useState, useEffect } from "react";

export default function WrappedSection({
  topArtists,
  topTracks,
  topGenres,
  onItemClick,
  onTimeRangeChange,
  timeRange,
}: {
  topArtists: any[];
  topTracks: any[];
  topGenres: string[];
  timeRange: string;
  onItemClick: (id: string, imageUrl: string, type: "track" | "artist") => void;
  onTimeRangeChange: (range: string) => void;
}) {
  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    onTimeRangeChange(value);
  };

  return (
    <section className="w-full p-8 text-white flex flex-col gap-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-2">O teu Spotify</h2>
        <p className="text-lg text-gray-300">
          Baseado nos artistas e nas músicas mais ouvidas
        </p>
        <div className="mt-4">
          <select
            value={timeRange}
            onChange={handleRangeChange}
            className="bg-slate-600 text-white px-6 py-2 text-center rounded-2xl cursor-pointer hover:bg-slate-500 transition-all"
          >
            <option value="short_term">Último mês</option>
            <option value="medium_term">Últimos 6 meses</option>
            <option value="long_term">Desde sempre</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-14 w-[70%] m-auto">
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-2xl font-semibold mb-4">Top Géneros</h3>
          <ul className="flex flex-wrap gap-3">
            {Array.isArray(topGenres) &&
              topGenres.map((genre, index) => (
                <li
                  key={index}
                  className="px-4 py-2 bg-slate-700 rounded-full capitalize"
                >
                  {genre}
                </li>
              ))}
          </ul>
        </div>
        {/* artistas */}
        <div className="flex flex-col justify-center items-center gap-8">
          <h3 className="text-2xl font-semibold mb-4">Top Artistas</h3>
          <div className="flex flex-wrap gap-6">
            {Array.isArray(topArtists) &&
              topArtists.map((artist, index) => (
                <div
                  key={artist.id}
                  className="relative w-44 h-44 flex-grow aspect-square rounded-xl overflow-hidden group shadow-lg"
                  style={{
                    backgroundImage: `url(${
                      artist.images[0]?.url || "/fallback.png"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative flex flex-col justify-center items-center text-center">
                      {/* Number badge above */}
                      <div className="absolute -top-6">
                        <div className="bg-slate-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                      </div>

                      {/* Artist name link */}
                      <a
                        href={artist.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white text-center font-semibold text-sm mt-4 px-4 hover:text-slate-400 hover:underline transition-all"
                      >
                        {artist.name}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div>
          {/* tracks */}
          <div className="flex flex-col justify-center items-center gap-8">
            <h3 className="text-2xl font-semibold mb-4">Top Músicas</h3>
            <div className="flex flex-wrap gap-6 justify-center items-center">
              {Array.isArray(topTracks) &&
                topTracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="relative w-44 h-44 flex-grow aspect-square rounded-xl overflow-hidden group shadow-lg"
                    style={{
                      backgroundImage: `url(${
                        track.album?.images?.[0]?.url || "/fallback.png"
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() =>
                      onItemClick(
                        track.id,
                        track.album?.images?.[0]?.url || "/fallback.png",
                        "track"
                      )
                    }
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer">
                      <div className="relative flex flex-col justify-center items-center text-center">
                        {/* Number badge above */}
                        <div className="absolute -top-6">
                          <div className="bg-slate-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                        </div>

                        {/* Track name + artist */}
                        <a
                          href={track.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white text-center font-semibold text-sm mt-4 px-4 hover:text-slate-400 hover:underline transition-all"
                        >
                          {track.name} — {track.artists[0].name}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
