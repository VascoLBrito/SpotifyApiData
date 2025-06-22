import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { access_token, time_range = "long_term" } = await req.json();

    if (!access_token) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    // 1. Fetch Top Artists
    const topArtistsRes = await fetch(
      `https://api.spotify.com/v1/me/top/artists?limit=20&time_range=${time_range}`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    const topArtistsData = await topArtistsRes.json();

    if (!topArtistsRes.ok || !Array.isArray(topArtistsData.items)) {
      console.error("❌ Failed to fetch top artists:", topArtistsData);
      return NextResponse.json(
        { error: "Failed to fetch top artists", details: topArtistsData },
        { status: 500 }
      );
    }

    // 2. Fetch Top Tracks
    const topTracksRes = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=${time_range}`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    const topTracksData = await topTracksRes.json();

    if (!topTracksRes.ok || !Array.isArray(topTracksData.items)) {
      console.error("❌ Failed to fetch top tracks:", topTracksData);
      return NextResponse.json(
        { error: "Failed to fetch top tracks", details: topTracksData },
        { status: 500 }
      );
    }

    // 3. Extract top genres
    const genreCount: Record<string, number> = {};
    topArtistsData.items.forEach((artist: any) => {
      if (Array.isArray(artist.genres)) {
        artist.genres.forEach((genre: string) => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      }
    });

    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre]) => genre);

    return NextResponse.json({
      topArtists: topArtistsData.items,
      topTracks: topTracksData.items,
      topGenres,
    });
  } catch (err) {
    console.error("❌ Wrapped error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
