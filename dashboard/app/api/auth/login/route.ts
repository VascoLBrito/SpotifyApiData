import { NextResponse } from "next/server";

export async function GET() {
  const scopes = "user-read-email user-top-read user-read-private";
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const clientId = process.env.SPOTIFY_CLIENT_ID; // 👈 ESTA LINHA FALTAVA

  const loginUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
    scopes
  )}&redirect_uri=${encodeURIComponent(redirectUri!)}`;

  return NextResponse.redirect(loginUrl);
}
