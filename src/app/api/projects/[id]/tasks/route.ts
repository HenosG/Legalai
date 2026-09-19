$path = "src/app/api/projects/[id]/tasks"
if (!(Test-Path $path)) { New-Item -ItemType Directory -Force -Path $path }
$code = @"
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId: params.id },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const task = await prisma.task.create({
      data: {
        projectId: params.id,
        title: body.title,
        status: body.status || "TODO",
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
"@
Set-Content -Path "src/app/api/projects/[id]/tasks/route.ts" -Value $code -Encoding utf8