import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/proposals - Fetch proposals (with optional status filter like DRAFT,SENT)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const whereClause = status ? { status: { in: status.split(",") } } : undefined;

    const proposals = await prisma.proposal.findMany({
      where: whereClause,
      include: { client: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 });
  }
}

// POST /api/proposals - Create a new proposal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, clientId, amount, content, intakeId, scopeOfWork, timeline } = body;

    // Default amount to 0 if not provided, ensuring USD representation
    const parsedAmount = amount ? parseFloat(amount) : 0;

    const newProposal = await prisma.proposal.create({
      data: {
        title: title || "New Proposal",
        clientId,
        amount: parsedAmount,
        content: content || scopeOfWork || "",
        status: "DRAFT",
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE_PROPOSAL",
        description: `Created proposal "${newProposal.title}" for amount $${parsedAmount} USD`,
      },
    });

    return NextResponse.json(newProposal, { status: 201 });
  } catch (error) {
    console.error("Error creating proposal:", error);
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 });
  }
}