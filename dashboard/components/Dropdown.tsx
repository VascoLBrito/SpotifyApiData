"use client";

import { useEffect, useState } from "react";

type Genre = {
  id: number;
  name: string;
};

export default function GenreDropdown({
  selectedGenre,
  setSelectedGenre,
}: {
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
}) {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch("/spotify_genres.json");
        const data = await res.json();
        setGenres(data);
      } catch (err) {
        console.error("❌ Failed to load genres:", err);
      }
    };

    fetchGenres();
  }, []);

  return (
    <select
      value={selectedGenre}
      onChange={(e) => setSelectedGenre(e.target.value)}
      className="w-full p-2 px-4 text-xl text-center rounded-md capitalize"
    >
      <option value="">Todos os géneros</option>

      {genres.map((genre) => (
        <option key={genre.id} value={genre.name} className="capitalize">
          {genre.name}
        </option>
      ))}
    </select>
  );
}
