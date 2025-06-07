# src/run_pipeline.py
import requests 
import pandas as pd
import sys
import os
from pathlib import Path
from datetime import datetime
from spotify_api import get_token, get_top_tracks, search_artists_by_genre

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
os.makedirs(DATA_DIR, exist_ok=True)

def fetch_top10_by_genre(genre):
    token = get_token()
    artists = search_artists_by_genre(genre, token)

    print(f"🎯 Foram encontrados {len(artists)} artistas para o género '{genre}'")
    for artist in artists:
      print("👤", artist["name"])

    records = []

    for artist in artists:
        artist_name = artist["name"]
        artist_id = artist["id"]
        print(f"🎤 {artist_name}")

                # Obter info do artista
        artist_info_url = f"https://api.spotify.com/v1/artists/{artist_id}"
        headers = {"Authorization": f"Bearer {token}"}
        artist_response = requests.get(artist_info_url, headers=headers)
        artist_response.raise_for_status()
        artist_info = artist_response.json()

        followers = artist_info.get("followers", {}).get("total")
        genres = ", ".join(artist_info.get("genres", []))


        try:
            top_tracks = get_top_tracks(artist_id, token)
            if top_tracks:
                top = top_tracks[0]
                ms = top["duration_ms"]
                duration_min = round(ms / 60000, 2)
                records.append({
                  "music_genre": genre,
                  "artist_name": artist_name,
                  "followers": followers,
                  "artist_genres": genres,
                  "track_name": top["name"],
                  "popularity": top["popularity"],
                  "release_date": top["album"]["release_date"],
                  "duration_min": duration_min,
                  "spotify_url": top["external_urls"]["spotify"],
                  "preview_url": top.get("preview_url"),
                  "explicit": top.get("explicit"),
                  "track_number": top.get("track_number"),
                  "album_name": top["album"]["name"],
                  "album_cover_url": top["album"]["images"][0]["url"] if top["album"]["images"] else None
              })

        except Exception as e:
            print(f"⚠️ Erro com {artist_name}: {e}")

    if not records:
        print("Nenhum dado encontrado.")
        return

    df = pd.DataFrame(records)
    today = datetime.now().strftime("%Y-%m-%d")
    filename = f"top10_{genre}_{today}.csv"
    df.to_csv(DATA_DIR / filename, index=False)
    print(f"✅ CSV salvo em data/{filename}")



if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("indica um genero musical")
        sys.exit(1)
    genre = sys.argv[1]
    fetch_top10_by_genre(genre)
