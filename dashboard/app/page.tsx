"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";
import GenreDropdown from "@/components/Dropdown";

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isShrunk, setIsShrunk] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<any | null>(null);

  const fetchTop10 = async (selectedGenre: string) => {
    console.log("Fetching top 10 for:", selectedGenre);
    setLoading(true);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre: selectedGenre.toLowerCase() }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Server error:", res.status, errText);
        setTracks([]);
        return;
      }

      const data = await res.json();
      const formatted = data.tracks.items.map((track: any) => {
        const [year, month, day] = track.album.release_date.split("-");
        const formattedDate = `${day}-${month}-${year}`;

        return {
          track_name: track.name,
          artist_name: track.artists[0]?.name,
          artist_url: track.artists[0]?.external_urls?.spotify,
          spotify_url: track.external_urls.spotify,
          album_cover_url: track.album.images[0]?.url,
          release_date: formattedDate,
          genre: selectedGenre,
          popularity: track.popularity,
        };
      });

      setTracks(formatted);
    } catch (error) {
      console.error("Erro ao buscar recomendações do Spotify:", error);
      setTracks([]);
    }

    setLoading(false);
  };

  const handleClick = (spotifyUrl: string) => {
    const trackId = spotifyUrl.split("track/")[1]?.split("?")[0];
    setSelectedTrackId(trackId);
  };

  useEffect(() => {
    if (selectedGenre) {
      fetchTop10(selectedGenre);
    }
  }, [selectedGenre]);

  return (
    <div
      className=" mt-12 p-6 
     justify-center h-screen "
    >
      <div className="flex flex-col justify-start p-4  w-full text-white">
        {selectedGenre ? (
          <h1 className="text-3xl text-center font-bold mb-4 uppercase">
            Top - {selectedGenre}
          </h1>
        ) : (
          <h1 className="text-3xl text-center font-bold mb-4 uppercase">
            Spotify Top Recommendations by Genre
          </h1>
        )}
        <div className="text-black p-2 text-center ">
          <GenreDropdown
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
          />
        </div>
      </div>

      {/* If a genre is selected and it's still loading, a spinner will appear. If it's not loading, a grid with the songs will appear. If a genre is not selected info about the app will appear */}
      {selectedGenre ? (
        loading ? (
          <div className="h-screen w-full p-4 grid justify-center items-center ">
            <Spinner className="text-white"></Spinner>
          </div>
        ) : Array.isArray(tracks) && tracks.length > 0 ? (
          <section className="relative grid">
            <div className="relative w-[80%] m-auto mb-36 p-4 grid justify-center items-start h-full">
              <div className="relative flex flex-wrap mt-12 justify-center gap-8 items-center">
                {/* For each song make a card with their info */}
                {tracks.map((track: any, i: number) => (
                  <a
                    key={i}
                    onClick={() => {
                      handleClick(track.spotify_url);
                      setSelectedTrack(track);
                      setIsShrunk(false);
                    }}
                    className="group overflow-hidden rounded-xl w-[16rem] h-[16rem] cursor-pointer hover:shadow-none"
                  >
                    <div className="relative flex flex-col text-black transition-all">
                      <img
                        src={track.album_cover_url}
                        alt={track.artist_name}
                        className="w-full aspect-square"
                      />
                      <div className="bg-black bg-opacity-90 w-full h-full absolute flex flex-col justify-center items-center gap-2 pt-2 p-4 translate-y-[200%] group-hover:translate-y-[0%] transition-all text-white">
                        <h1 className="bg-white text-center rounded-full aspect-square text-black p-1">
                          {track.popularity}
                        </h1>

                        <h1>
                          <a
                            href={track.artist_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-400"
                          >
                            {track.artist_name}
                          </a>
                        </h1>

                        <p className="text-center font-extrabold ">
                          {" "}
                          {track.track_name}
                        </p>
                        <p>{track.release_date}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div
              className={`z-10 fixed right-0 top-0 backdrop-blur-0 h-screen bg-black flex justify-center items-center p-4 transition-all duration-300 ${
                isShrunk ? "w-[0%]" : "w-[50%]"
              }`}
            >
              <div
                className=" backdrop-blur-0  text-white w-full flex justify-center items-center"
                style={{
                  backgroundImage: selectedTrack
                    ? `url(${selectedTrack.album_cover_url})`
                    : "none",
                  backgroundSize: "cover",
                  height: "100%",
                  borderRadius: "2%",
                  opacity: "95%",
                  // backgroundPosition: "center",⁄
                }}
              >
                {/* if a card is clicked show a spotify embebed with the corresponding song */}
                {selectedTrackId ? (
                  <iframe
                    src={`https://open.spotify.com/embed/track/${selectedTrackId}`}
                    width={isShrunk ? "0" : "640"}
                    height={isShrunk ? "0" : "200"}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded"
                  ></iframe>
                ) : (
                  <p></p>
                )}
              </div>
              {!isShrunk ? (
                <button
                  className="absolute top-8 right-8 aspect-square text-white bg-black rounded-full p-4 min-h-4 min-w-4 hover:bg-slate-300 hover:text-black flex justify-center items-center transition-all"
                  onClick={() => setIsShrunk(true)}
                >
                  <p>X</p>
                </button>
              ) : (
                <button
                  className="absolute top-0 right-0 text-white p-4"
                  onClick={() => setIsShrunk(true)}
                ></button>
              )}
            </div>
          </section>
        ) : (
          <div className="h-screen w-full p-4 grid justify-center items-center ">
            <Spinner className="text-white">
              <span className="text-white pt-4 capitalize">
                A carregar o top músicas de {selectedGenre}{" "}
              </span>
            </Spinner>
          </div>
        )
      ) : (
        <div className=" mt-36 text-center text-xl  w-[55%] m-auto grid justify-center items-center p-4 rounded text-white">
          <p>
            <strong> Spotify Data Explorer</strong> é uma aplicação interativa
            que permite aos utilizadores explorarem as músicas mais populares
            por género musical. <br></br> Baseado numa lista de 4 género
            musicais diferentes, cada uma com os artistas relacionados, são
            extraidas da base de dados pública do Spotify e apresentadas ao
            utilizador informações como o grau de popularidade (100 = mais
            popular), o nome do artista, a música, albúm, número de seguidores,
            e um excerto da música no Spotify incoporado na aplicação.
            <br></br>
            Esta aplicação serve como uma pequena amostra funcional do que
            poderia ser uma plataforma mais extensa de análise de tendências
            musicais tendo acesso à base de dados na sua totalidade.
          </p>
        </div>
      )}
    </div>
  );
}
