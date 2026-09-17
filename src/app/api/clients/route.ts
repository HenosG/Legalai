import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/clients - Fetch all clients (with optional status filter)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const clients = await prisma.client.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

// POST /api/clients - Create a new client
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, status } = body;

    const newClient = await prisma.client.create({
      data: {
        name,
        company,
        email,
        phone,
        status: status || "ACTIVE",
      },
    });

    // Optional: Log this action in your ActivityLog table
    await prisma.activityLog.create({
      data: {
        action: "CREATE_CLIENT",
        description: `Created new client: ${name} (${company || "N/A"})`,
      },
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}