// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect("http://127.0.0.1:3000");
  res.cookies.set("spotify_token", "", {
    path: "/",
    expires: new Date(0),
  });
  return res;
}
