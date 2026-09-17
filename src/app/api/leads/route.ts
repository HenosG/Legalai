import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/leads - Fetch all leads (with optional status filter)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const leads = await prisma.lead.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

// POST /api/leads - Create/Intake a new lead
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, notes, estimatedValue } = body;

    const newLead = await prisma.lead.create({
      data: {
        name,
        email,
        company,
        notes,
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
        status: "NEW",
      },
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        action: "CREATE_LEAD",
        description: `New lead captured: ${name} (${company || "Independent"})`,
      },
    });

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}