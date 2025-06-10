import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { genre } = await req.json();

    // ✅ Log the genre received from the client

    if (!genre) {
      return NextResponse.json({ error: "Genre is required" }, { status: 400 });
    }

    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const auth = Buffer.from(`${client_id}:${client_secret}`).toString(
      "base64"
    );

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const { access_token } = await tokenRes.json();

    const url = `https://api.spotify.com/v1/search?q=genre:${genre}&type=track&limit=50`;

    const recRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!recRes.ok) {
      const errorText = await recRes.text();
      console.error("Spotify API error:", recRes.status, errorText);

      return NextResponse.json(
        {
          error: "Spotify API error",
          status: recRes.status,
          message: errorText,
        },
        { status: recRes.status }
      );
    }

    const data = await recRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Unexpected error", details: error },
      { status: 500 }
    );
  }
}
