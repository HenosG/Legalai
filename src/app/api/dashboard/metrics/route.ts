import { NextResponse } from "next/server";
// Adjust your prisma import path as needed for your project setup
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Fetch counts and aggregated values in parallel
    const [activeClients, openProposals, activeProjects, unpaidInvoices, recentLogs] = await Promise.all([
      prisma.client.count({ where: { status: "ACTIVE" } }),
      prisma.proposal.count({ where: { status: { in: ["DRAFT", "SENT"] } } }),
      prisma.project.count({ where: { status: "IN_PROGRESS" } }),
      prisma.invoice.findMany({ where: { status: { in: ["UNPAID", "OVERDUE"] } } }),
      prisma.activityLog.findMany({ take: 10, orderBy: { createdAt: "desc" } }),
    ]);

    // Calculate total outstanding amount
    const outstandingRevenue = unpaidInvoices.reduce(
      (acc, inv) => acc + (inv.amount - inv.amountPaid),
      0
    );

    return NextResponse.json({
      stats: {
        activeClients,
        openProposals,
        activeProjects,
        outstandingRevenue,
      },
      activityLogs: recentLogs,
    });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 });
  }
}