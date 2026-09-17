import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = params.id;

    // 1. Fetch the lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // 2. Create a new Client record from lead data
    const client = await prisma.client.create({
      data: {
        name: lead.name,
        email: lead.email,
        company: lead.company || "Independent",
        phone: lead.phone,
        status: "ACTIVE",
      },
    });

    // 3. Draft an initial Proposal linked to this new client
    await prisma.proposal.create({
      data: {
        clientId: client.id,
        title: `Project Proposal for ${lead.company || lead.name}`,
        amount: 5000.0, // Default baseline proposal amount
        status: "DRAFT",
        scope: lead.notes || lead.projectScope || "Standard project delivery scope.",
      },
    });

    // 4. Update lead status to CONVERTED
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: "CONVERTED" },
    });

    return NextResponse.json({ success: true, clientId: client.id });
  } catch (error) {
    console.error("Failed to convert lead:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}