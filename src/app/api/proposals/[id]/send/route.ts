import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const proposalId = params.id;
    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: "SENT" },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to send proposal:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}