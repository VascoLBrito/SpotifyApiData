// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect("/");
  res.cookies.set("spotify_token", "", {
    path: "/",
    expires: new Date(0),
  });
  return res;
}
