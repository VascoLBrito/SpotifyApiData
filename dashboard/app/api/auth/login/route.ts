import { NextResponse } from "next/server";

export async function GET() {
  const scopes = "user-read-email user-top-read user-read-private";
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  const loginUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
    scopes
  )}&redirect_uri=${encodeURIComponent(redirectUri!)}&show_dialog=true`;

  console.log("Redirecting to Spotify:", loginUrl);
  if (!clientId || !redirectUri) {
    console.error("Missing Spotify credentials");
    return NextResponse.json(
      { error: "Missing client ID or redirect URI" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(loginUrl);
}
