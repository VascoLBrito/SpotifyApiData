"use client";

import { useEffect, useState } from "react";

type Genre = {
  id: number;
  name: string;
};

export default function GenreDropdown({
  selectedGenre,
  onGenreChange,
}: {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}) {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch("/spotify_genres.json");
      const data = await res.json();
      setGenres(data);
    };

    fetchGenres();
  }, []);

  return (
    <select
      value={selectedGenre}
      onChange={(e) => onGenreChange(e.target.value)}
      className="min-w-[12rem] p-2 px-4 text-xl text-center rounded-md capitalize"
    >
      <option value="">Seleciona um Estilo</option>
      {genres.map((genre) => (
        <option key={genre.id} value={genre.name} className="capitalize">
          {genre.name}
        </option>
      ))}
    </select>
  );
}
