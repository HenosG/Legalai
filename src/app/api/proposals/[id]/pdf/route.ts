import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Return plain text / markdown representation for simple PDF/document export
    const documentText = `PROPOSAL: ${proposal.title}\nAMOUNT: $${proposal.amount}\nSTATUS: ${proposal.status}\n\nSCOPE:\n${proposal.scope}`;

    return new NextResponse(documentText, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="proposal-${proposal.id}.txt"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}