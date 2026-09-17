import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const projects = await prisma.project.findMany({
      where: status ? { status: { in: status.split(",") } } : undefined,
      include: { client: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, clientId, budget, deadline } = body;

    const newProject = await prisma.project.create({
      data: {
        name,
        clientId,
        budget: budget ? parseFloat(budget) : null,
        deadline: deadline ? new Date(deadline) : null,
        status: "IN_PROGRESS",
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE_PROJECT",
        description: `Started new project: "${name}"`,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}