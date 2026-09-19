import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  return NextResponse.json({ success: true, removedUserId: params.userId });
}