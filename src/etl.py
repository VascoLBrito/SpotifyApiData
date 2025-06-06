# src/run_pipeline.py
import requests 
import pandas as pd
import sys
import os
from pathlib import Path
from datetime import datetime
from spotify_api import get_token, get_top_tracks, search_artists_by_genre

# At the top of the file (after imports):
ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
os.makedirs(DATA_DIR, exist_ok=True)

# src/etl.py

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


# def fetch_artists_from_input():
#     token = get_token()
#     print("Digite nomes de artistas separados por vírgula:")
#     input_str = sys.argv[1]  # pega o argumento passado pelo terminal
#     artist_names = [name.strip() for name in input_str.split(",")]

#     artist_data = []
#     for name in artist_names:
#         artist_id = get_artist_id(name, token)
#         if artist_id:
#             print(f"{name} → {artist_id}")
#             artist_data.append({"name": name, "id": artist_id})
#         else:
#             print(f"❌ {name} não encontrado.")

#     df_artists = pd.DataFrame(artist_data)
#     df_artists.to_csv(DATA_DIR / "artists.csv", index=False)
#     return df_artists, token

# def fetch_albums(df_artists, token):
#     albums_data = []
#     for _, row in df_artists.iterrows():
#         artist_name = row['name']
#         artist_id = row['id']
#         print(f"📀 Buscando álbuns de {artist_name}")
#         albums = get_artist_albums(artist_id, token)
#         for album in albums:
#             albums_data.append({
#                 "artist_name": artist_name,
#                 "artist_id": artist_id,
#                 "album_id": album["id"],
#                 "album_name": album["name"],
#                 "release_date": album["release_date"],
#                 "total_tracks": album["total_tracks"],
#                 "album_type": album["album_type"],
#                 "album_image_url" : album["images"] [0]["url"] if album["images"] else None            
#                 })

#     df_albums = pd.DataFrame(albums_data).drop_duplicates(subset="album_id")
#     df_albums.to_csv(DATA_DIR / "albums.csv", index=False)
#     return df_albums

# def fetch_tracks(df_albums, token):
#     tracks_data = []
#     for _, row in df_albums.iterrows():
#         artist_name = row["artist_name"]
#         album_name = row["album_name"]
#         album_id = row["album_id"]
#         album_image_url = row.get("album_image_url")
#         release_date= row["release_date"]

#         print(f"🎶 Buscando faixas do álbum {album_name} ({artist_name})")

#         try:
#             tracks = get_album_tracks(album_id, token)
#             for track in tracks:
#                 ms = track["duration_ms"]
#                 minutes = ms // 60000
#                 seconds = (ms % 60000) // 1000
#                 duration_min = round(ms / 60000, 2)
#                 duration_formatted = f"{int(minutes)}:{int(seconds):02}"

#                 tracks_data.append({
#                     "artist_name": artist_name,
#                     "album_name": album_name,
#                     "album_id": album_id,
#                     "release_date": release_date,
#                     "track_name": track["name"],
#                     "track_id": track["id"],
#                     "track_number": track["track_number"],
#                     "duration_formatted": duration_formatted,
#                     "album_image_url": album_image_url
#                 })
#         except Exception as e:
#           print(f"⚠️ Erro em {album_name}: {e}")

#     df_tracks = pd.DataFrame(tracks_data).drop_duplicates(subset="track_id")
#     df_tracks.to_csv(DATA_DIR / "tracks.csv", index=False)

# def main():
#     df_artists, token = fetch_artists_from_input()
#     df_albums = fetch_albums(df_artists, token)
#     fetch_tracks(df_albums, token)
#     print("✅ Pipeline completa!")


