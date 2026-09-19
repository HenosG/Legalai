$path = "src/app/api/tasks/[id]"
if (!(Test-Path $path)) { New-Item -ItemType Directory -Force -Path $path }
$code = @"
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await prisma.task.update({
      where: { id: params.id },
      data: {
        status: body.status,
        title: body.title,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.task.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
"@
Set-Content -Path "src/app/api/tasks/[id]/route.ts" -Value $code -Encoding utf8