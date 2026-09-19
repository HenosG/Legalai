import { NextResponse } from "next/server";

export async function GET() {
  const mockTeam = [
    { id: "user_1", email: "henos@mbci.mb.ca", role: "ADMIN" }
  ];
  return NextResponse.json(mockTeam);
}