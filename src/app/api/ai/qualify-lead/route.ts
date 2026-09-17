import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { leadId } = await request.json();

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Determine score heuristics (simulated AI evaluation based on scope length/keywords)
    const scopeText = (lead.notes || lead.projectScope || "").toLowerCase();
    let assignedScore = "WARM";

    if (scopeText.includes("urgent") || scopeText.includes("budget") || scopeText.includes("mvp") || scopeText.length > 100) {
      assignedScore = "HOT";
    } else if (scopeText.length < 20) {
      assignedScore = "COLD";
    }

    // Update lead in database with new score and QUALIFIED status
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        score: assignedScore,
        status: "QUALIFIED",
      },
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("AI qualification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}