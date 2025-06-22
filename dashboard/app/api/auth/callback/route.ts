import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code!,
      redirect_uri: redirectUri!,
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.access_token) {
    console.log("✅ User access token:", tokenData.access_token);
    // Here you'd store the token in a cookie or session — for now, just redirect
    return NextResponse.redirect(
      `http://127.0.0.1:3000/?token=${tokenData.access_token}`
    );
  } else {
    console.error("❌ Failed to fetch token:", tokenData);
    return NextResponse.redirect("/error");
  }
}
