import { NextResponse } from "next/server";
import { getWorldCupFeed } from "@/lib/worldcup-data";

export async function GET() {
  const feed = await getWorldCupFeed();
  return NextResponse.json(feed, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" }
  });
}