$code = @"
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updated = await prisma.invoice.update({
      where: { id: params.id },
      data: { status: "SENT" },
    });
    return NextResponse.json({ success: true, invoice: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
"@
Set-Content -Path "src/app/api/invoices/[id]/send/route.ts" -Value $code -Encoding utf8