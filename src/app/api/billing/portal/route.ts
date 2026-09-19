import { NextResponse } from "next/server";

export async function GET() {
  // Simulated Stripe Customer Portal redirect URL
  return NextResponse.json({ url: "/settings/billing?portal=success" });
}