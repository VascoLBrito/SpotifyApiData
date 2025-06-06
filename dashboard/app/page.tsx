"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// export default function Home() {
//   const [tracks, setTracks] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     setLoading(true);
//     const res = await fetch("/api/extract", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ artists: input }),
//     });

//     await loadTracks();
//     const result = await res.json();
//     setLoading(false);
//     alert(result.message || "Erro ao extrair dados");
//   };

//   const loadTracks = async () => {
//     fetch("/api/tracks")
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("🔍 Dados recebidos:", data[0]);
//         setTracks(data);
//       });
//   };
//   useEffect(() => {
//     loadTracks();
//   }, []);

//   const artistNames = [...new Set(tracks.map((t) => t.artist_name))];
//   const artistDisplay = artistNames.join(", ");

//   const data_lenght = tracks.length;

//   const getTrackStats = (tracks) => {
//     if (!tracks || tracks.length === 0) return null;

//     const durations = tracks
//       .map((t) => parseFloat(t.duration_formatted))
//       .filter(Boolean);

//     const total = durations.length;
//     const sum = durations.reduce((acc, val) => acc + val, 0);
//     const average = (sum / total).toFixed(2);
//     const min = Math.min(...durations).toFixed(2);
//     const max = Math.max(...durations).toFixed(2);

//     return { total, average, min, max };
//   };

//   const getShortestTrack = (tracks) => {
//     if (!tracks || tracks.length === 0) return null;

//     return tracks.reduce((minTrack, current) => {
//       const currentDuration = parseFloat(current.duration_min || "0");
//       const minDuration = parseFloat(minTrack.duration_min || "0");

//       return currentDuration < minDuration ? current : minTrack;
//     });
//   };
//   const shortest = getShortestTrack(tracks);

//   const stats = getTrackStats(tracks);

//   return (
//     <main>
//       <div className="p-6 ">
//         <h1 className="text-2xl font-bold mb-4">Buscar dados de artistas</h1>
//         <div className="flex gap-2 items-center">
//           <input
//             className="border p-2 mr-2 w-96 text-black"
//             placeholder="Mariza, Slow J, Carolina Deslandes..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//           />

//           <button
//             onClick={handleSubmit}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             {loading ? "Buscando..." : "Extrair"}
//           </button>

//           <dropdown> </dropdown>

//           <p className=" ml-12 font-bold "> Músicas: {data_lenght}</p>
//         </div>
//       </div>
//       {stats && (
//         <div className="mt-8 p-4 border rounded-lg shadow  text-black bg-white w-fit mx-auto">
//           <h2 className="text-xl  font-bold mb-2">
//             📊 Estatísticas das Faixas
//           </h2>
//           <p>
//             Total de faixas: <strong>{stats.total}</strong>
//           </p>
//           <p>
//             Média de duração: <strong>{stats.average} min</strong>
//           </p>

//           {shortest && (
//             <p>
//               🎧 Faixa mais curta: <strong>{shortest.track_name}</strong> (
//               {shortest.duration_formatted})
//             </p>
//           )}
//           <p>
//             Duração mínima: <strong>{stats.min} min</strong>
//           </p>
//           <p>
//             Duração máxima: <strong>{stats.max} min</strong>
//           </p>
//         </div>
//       )}

//       <div className="grid grid-flow-row p-6">
//         <h1 className="text-2xl m-auto w-fit font-bold mb-12 capitalize ">
//           Faixas Extraídas de {artistDisplay}
//         </h1>

//         <div className="table-auto w-[70%] justify-center items-center flex flex-wrap m-auto text-sm gap-y-11">
//           <div className="flex flex-wrap justify-center">
//             {tracks.map((track, i) => (
//               <span key={i} className="flex flex-col gap-4  m-4 max-w-[12rem]">
//                 <div>
//                   <img
//                     className=" w-full aspect-square rounded-full shadow-md hover:scale-110 hover:shadow-white transition-all cursor-pointer"
//                     src={track.album_image_url}
//                   />
//                 </div>
//                 <div className="items-end justify-end">
//                   <p className="p-2">{track.album_name}</p>
//                   <p className="p-2">{track.track_name}</p>
//                   <p className="p-2">{track.release_date}</p>
//                   <p className="p-2">{track.duration_formatted}</p>
//                 </div>
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

const GENRES = ["Pop", "Hip-hop", "Rock", "Fado", "jazz"];

export default function Home() {
  const [genre, setGenre] = useState("pop");
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
      <div className="flex flex-col justify-start  w-full">
        <h1 className="text-3xl text-center font-bold mb-4 uppercase">
          Top 10 - {genre}
        </h1>
        <div className="text-black p-2 text-center ">
          <select
            value={genre}
            onChange={(e) => {
              const selected = e.target.value;
              setGenre(selected);
              fetchAndLoadGenre(selected);
            }}
            className="w-[12rem] p-2 text-xl text-center"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!loading ? (
        Array.isArray(tracks) && tracks.length > 0 ? (
          <div className="w-full p-4 grid justify-center items-center h-full">
            <div className="relative flex flex-wrap mt-6 justify-center gap-8 items-center">
              {tracks.map((track: any, i: number) => (
                <a
                  href={track.spotify_url}
                  target="_blank"
                  className="group overflow-hidden shadow-sm shadow-white rounded-xl w-[16rem] h-[16rem]  cursor-pointer hover:shadow-none "
                  key={i}
                >
                  <div className="relative  flex flex-col text-black transition-all  ">
                    <img
                      src={track.album_cover_url}
                      alt={track.artist_name}
                      className="w-full aspect-square"
                    />
                    <div className="bg-black bg-opacity-90 w-full h-full absolute flex flex-col justify-center items-center gap-2 pt-2 p-4 translate-y-[200%] group-hover:translate-y-[0%] transition-all text-white">
                      <h2 className="text-2xl">{track.artist_name}</h2>
                      <p className=""> {track.followers} Seguidores</p>
                      <p className="">{track.genre}</p>
                      <p className="text-center">{track.track_name}</p>
                      <p className="">{track.release_date}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full grid justify-center items-center">
            <p className="text-center">
              <span className="loading loading-dots loading-xl"></span>
            </p>
          </div>
        )
      ) : (
        <div className="h-full grid justify-center items-center">
          <p className="text-center">
            <span className="loading loading-dots loading-xl"></span>
          </p>
        </div>
      )}
    </div>
  );
}
