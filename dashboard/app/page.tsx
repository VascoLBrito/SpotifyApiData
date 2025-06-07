"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";

const GENRES = ["Pop", "Hip-hop", "Rock", "Fado", "jazz"];

export default function Home() {
  const [genre, setGenre] = useState("");

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTop10 = async (selectedGenre: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/top10?genre=${selectedGenre}`);
      const data = await res.json();
      console.log(data);
      if (!Array.isArray(data)) {
        console.warn("dados nao sao array:", data);
        setTracks([]);
      } else {
        setTracks(data);
      }
    } catch (error) {
      console.error("Erro ao buscar top 10:", error);
      setTracks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTop10(genre);
  }, [genre]);

  const fetchAndLoadGenre = async (selectedGenre: string) => {
    setLoading(true);

    // Step 1: Run the ETL first
    await fetch("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ genre: selectedGenre }),
    });

    // Step 2: Then load the CSV content
    const res = await fetch(`/api/top10?genre=${selectedGenre}`);
    const data = await res.json();
    setTracks(Array.isArray(data) ? data : []);
    setLoading(false);

    console.log("🎯 A lançar ETL para:", selectedGenre);
  };

  return (
    <div
      className=" mt-12 p-6 
     justify-center h-screen "
    >
      <div className="flex flex-col justify-start p-4  w-full text-white">
        {genre ? (
          <h1 className="text-3xl text-center font-bold mb-4 uppercase">
            Top 10 - {genre}
          </h1>
        ) : (
          <h1 className="text-3xl text-center font-bold mb-4 uppercase">
            Spotify Data Explorer
          </h1>
        )}
        <div className="text-black p-2 text-center ">
          <select
            value={genre}
            onChange={(e) => {
              const selected = e.target.value;
              setGenre(selected);
              fetchAndLoadGenre(selected);
            }}
            className="min-w-[12rem] p-2 px-4 text-xl text-center rounded-md"
          >
            <option value="" disabled hidden>
              Seleciona o TOP 10
            </option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {genre ? (
        loading ? (
          <div className="h-screen w-full p-4 grid justify-center items-center ">
            <Spinner className="text-white"></Spinner>
          </div>
        ) : tracks.length > 0 ? (
          <div className="w-[80%] m-auto p-4 grid justify-center items-start h-full">
            <div className="relative flex flex-wrap mt-12 justify-center gap-8 items-center">
              {tracks.map((track: any, i: number) => (
                <a
                  key={i}
                  href={track.spotify_url}
                  target="_blank"
                  className="group overflow-hidden rounded-xl w-[16rem] h-[16rem] cursor-pointer hover:shadow-none"
                >
                  <div className="relative flex flex-col text-black transition-all">
                    <img
                      src={track.album_cover_url}
                      alt={track.artist_name}
                      className="w-full aspect-square"
                    />
                    <div className="bg-black bg-opacity-90 w-full h-full absolute flex flex-col justify-center items-center gap-2 pt-2 p-4 translate-y-[200%] group-hover:translate-y-[0%] transition-all text-white">
                      <h2 className="text-2xl">{track.artist_name}</h2>
                      <p>{track.followers} Seguidores</p>
                      <p>{track.genre}</p>
                      <p className="text-center">{track.track_name}</p>
                      <p>{track.release_date}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-screen w-full p-4 grid justify-center items-center ">
            <Spinner className="text-white">
              <span className="text-white pt-4">
                A carregar TOP 10 músicas de {genre}{" "}
              </span>
            </Spinner>
          </div>
        )
      ) : (
        <div className=" h-full w-full grid justify-center items-center p-4 rounded text-white">
          Nenhum gênero selecionado.
        </div>
      )}
    </div>
  );
}
