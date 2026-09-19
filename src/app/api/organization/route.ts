import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ id: "org_1", name: "Reluno Legal AI Agency" });
}

export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true, organization: body });
}