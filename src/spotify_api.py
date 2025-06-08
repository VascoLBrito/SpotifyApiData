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


def get_top_tracks(artist_id, token, market="PT"):
    url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks"
    headers = {"Authorization": f"Bearer {token}"}
    params = {"market": market}
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()["tracks"]


