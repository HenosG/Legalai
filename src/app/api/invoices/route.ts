import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const invoices = await prisma.invoice.findMany({
      where: status ? { status: { in: status.split(",") } } : undefined,
      include: { client: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, amount, dueDate } = body;

    const newInvoice = await prisma.invoice.create({
      data: {
        clientId,
        amount: parseFloat(amount),
        amountPaid: 0,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: "UNPAID",
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE_INVOICE",
        description: `Generated invoice for $${amount}`,
      },
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}