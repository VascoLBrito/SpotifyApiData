# src/spotify_api.py
import os
import requests
from dotenv import load_dotenv
import time

load_dotenv()

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

# 1. Autenticação com Client Credentials Flow
def get_token(   
):
    url = 'https://accounts.spotify.com/api/token'
    response = requests.post(
        url,
        data={'grant_type': 'client_credentials'},
        auth=(CLIENT_ID, CLIENT_SECRET)
    )
    response.raise_for_status()
    return response.json()['access_token']

# 2. Buscar artista por nome e retornar ID
# def get_artist_id(artist_name, token):
#     url = "https://api.spotify.com/v1/search"
#     headers = {"Authorization": f"Bearer {token}"}
#     params = {"q": artist_name, "type": "artist", "limit": 1}
#     response = requests.get(url, headers=headers, params=params)
#     response.raise_for_status()
#     items = response.json()['artists']['items']
#     return items[0]['id'] if items else None

# def get_artist_albums(artist_id, token, market='PT'):
#     url = f"https://api.spotify.com/v1/artists/{artist_id}/albums"
#     headers = {"Authorization": f"Bearer {token}"}
#     params = {
#         "include_groups": "album,single",  # podes adicionar "appears_on", "compilation"
#         "market": market,
#         "limit": 50
#     }
#     response = requests.get(url, headers=headers, params=params)
#     response.raise_for_status()
#     data = response.json()
#     return data["items"]

# def get_album_tracks(album_id, token):
#     url = f"https://api.spotify.com/v1/albums/{album_id}/tracks"
#     headers = {"Authorization": f"Bearer {token}"}
#     params = {"limit": 50}
#     response = requests.get(url, headers=headers, params=params)
#     response.raise_for_status()
#     return response.json()["items"]

def search_artists_by_genre(genre, token, limit=10):
    url = "https://api.spotify.com/v1/search"
    headers = {"Authorization": f"Bearer {token}"}
    
    manual_artists_by_genre = {
        "pop": [
            "Dua Lipa", "Olivia Rodrigo", "Harry Styles",
            "Ariana Grande", "Taylor Swift", "Ed Sheeran", "Billie Eilish", "Justin Bieber",
            "Selena Gomez", "Katy Perry", "Shawn Mendes", "Camila Cabello", "Charlie Puth",
            "Britney Spears", "Madonna", "Rihanna", "Lady Gaga", "Sam Smith", "Adele",
            "Bruno Mars", "Doja Cat", "Troye Sivan"
        ],
        "fado": [
            "Mariza", "Carminho", "Ana Moura",
            "Camané", "Amália Rodrigues", "Cristina Branco", "Aldina Duarte", "Ricardo Ribeiro",
            "António Zambujo", "Gisela João", "Helena Sarmento", "Pedro Moutinho", "Mísia",
            "Teresa Salgueiro", "Maria Ana Bobone", "Marco Rodrigues", "Raquel Tavares",
            "Joana Amendoeira", "Celeste Rodrigues", "Lenita Gentil", "Vicente da Câmara",
            "Beatriz da Conceição"
        ],
        "hip-hop": [
            "ProfJam", "Wet Bed Gang", "Valete",
            "Sam The Kid", "Boss AC", "Halloween", "Piruka", "Slow J", "Phoenix RDC",
            "Kappa Jotta", "Capicua", "Deau", "Regula", "Virtus", "NBC", "Dillaz", "Papillon",
            "Allen Halloween", "Maze", "Fuse", "Mind da Gap", "Chong Kwong"
        ],
        "jazz": [
            "Miles Davis", "John Coltrane", "Billie Holiday", "Louis Armstrong", "Ella Fitzgerald",
            "Duke Ellington", "Chet Baker", "Herbie Hancock", "Thelonious Monk", "Charles Mingus",
            "Diana Krall", "Nina Simone", "Wynton Marsalis", "Norah Jones", "Pat Metheny",
            "Stan Getz", "Sonny Rollins", "Sarah Vaughan", "Oscar Peterson", "Keith Jarrett",
            "Esperanza Spalding", "Brad Mehldau"
        ],
        "rock": [
            "The Beatles", "Led Zeppelin", "The Rolling Stones", "Queen", "Pink Floyd",
            "AC/DC", "Nirvana", "The Who", "David Bowie", "Jimi Hendrix",
            "The Doors", "U2", "Radiohead", "Red Hot Chili Peppers", "Arctic Monkeys",
            "Green Day", "Foo Fighters", "Pearl Jam", "The Strokes", "Fleetwood Mac",
            "Muse", "Linkin Park"
        ]
    }


    artist_names = manual_artists_by_genre.get(genre.lower(), [])[:limit]
    artist_infos = []

    for name in artist_names:
        params = {"q": name, "type": "artist", "limit": 1}
        res = requests.get(url, headers=headers, params=params)
        res.raise_for_status()
        items = res.json()["artists"]["items"]
        if items:
            artist_infos.append(items[0])
        time.sleep(0.4)  # prevenir rate limit

    return artist_infos



# def search_artists_by_genre(genre, token, limit=10):
#     url = "https://api.spotify.com/v1/search"
#     headers = {"Authorization": f"Bearer {token}"}

#     artists = []
#     offset = 0
#     page_limit = 50

#     while len(artists) < limit:

#         params = {
#             "q": genre,
#             "type": "artist",
#             "limit": page_limit,
#             "offset": offset
#         }
#         response = requests.get(url, headers=headers, params=params)
#         response.raise_for_status()
#         all_artists =  response.json()["artists"]["items"]
        
#         if not all_artists:
#             break

#         filtered_api_artists = [
#             artist for artist in all_artists
#             if any(genre.lower() in g.lower() for g in artist.get("genres", []))
#         ]
#         print(f"{len(filtered_api_artists)} artistas encontrados no genero {genre}")

#     manual_artists_by_genre = {
#         "pop": [
#             "Dua Lipa", "Olivia Rodrigo", "Harry Styles",
#             "Ariana Grande", "Taylor Swift", "Ed Sheeran", "Billie Eilish", "Justin Bieber",
#             "Selena Gomez", "Katy Perry", "Shawn Mendes", "Camila Cabello", "Charlie Puth",
#             "Britney Spears", "Madonna", "Rihanna", "Lady Gaga", "Sam Smith", "Adele",
#             "Bruno Mars", "Doja Cat", "Troye Sivan"
#         ],
#         "fado": [
#             "Mariza", "Carminho", "Ana Moura",
#             "Camané", "Amália Rodrigues", "Cristina Branco", "Aldina Duarte", "Ricardo Ribeiro",
#             "António Zambujo", "Gisela João", "Helena Sarmento", "Pedro Moutinho", "Mísia",
#             "Teresa Salgueiro", "Maria Ana Bobone", "Marco Rodrigues", "Raquel Tavares",
#             "Joana Amendoeira", "Celeste Rodrigues", "Lenita Gentil", "Vicente da Câmara",
#             "Beatriz da Conceição"
#         ],
#         "hip-hop": [
#             "ProfJam", "Wet Bed Gang", "Valete",
#             "Sam The Kid", "Boss AC", "Halloween", "Piruka", "Slow J", "Phoenix RDC",
#             "Kappa Jotta", "Capicua", "Deau", "Regula", "Virtus", "NBC", "Dillaz", "Papillon",
#             "Allen Halloween", "Maze", "Fuse", "Mind da Gap", "Chong Kwong"
#         ],
#         "jazz": [
#             "Miles Davis", "John Coltrane", "Billie Holiday", "Louis Armstrong", "Ella Fitzgerald",
#             "Duke Ellington", "Chet Baker", "Herbie Hancock", "Thelonious Monk", "Charles Mingus",
#             "Diana Krall", "Nina Simone", "Wynton Marsalis", "Norah Jones", "Pat Metheny",
#             "Stan Getz", "Sonny Rollins", "Sarah Vaughan", "Oscar Peterson", "Keith Jarrett",
#             "Esperanza Spalding", "Brad Mehldau"
#         ],
#         "rock": [
#             "The Beatles", "Led Zeppelin", "The Rolling Stones", "Queen", "Pink Floyd",
#             "AC/DC", "Nirvana", "The Who", "David Bowie", "Jimi Hendrix",
#             "The Doors", "U2", "Radiohead", "Red Hot Chili Peppers", "Arctic Monkeys",
#             "Green Day", "Foo Fighters", "Pearl Jam", "The Strokes", "Fleetwood Mac",
#             "Muse", "Linkin Park"
#         ]
#     }

#     manual_artists = []
#     for name in manual_artists_by_genre.get(genre.lower(), []):
#             params = {"q": name, "type": "artist", "limit": 1}
#             res = requests.get(url, headers=headers, params=params)
#             res.raise_for_status()
#             items = res.json()["artists"]["items"]
#             if items:
#                 manual_artists.append(items[0])

#     print(f"➕ {len(manual_artists)} artistas adicionados manualmente")

#     # --- Parte 3: Combinar e remover duplicados ---
#     all_ids = set()
#     combined = []

#     for artist in filtered_api_artists + manual_artists:
#             if artist["id"] not in all_ids:
#                 combined.append(artist)
#                 all_ids.add(artist["id"])

#     print(f"✅ Total combinado: {len(combined)} artistas")
#     return combined[:limit]

def get_top_tracks(artist_id, token, market="PT"):
    url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks"
    headers = {"Authorization": f"Bearer {token}"}
    params = {"market": market}
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()["tracks"]


def get_artist_id_by_name(name, token):
    url = "https://api.spotify.com/v1/search"
    headers = {"Authorization": f"Bearer {token}"}
    params = {"q": name, "type": "artist", "limit": 1}
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    results = response.json()["artists"]["items"]
    return results[0] if results else None
