import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ id: "user_1", name: "Henos Goitom", email: "henos@mbci.mb.ca" });
}

export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true, user: body });
}