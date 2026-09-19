$path = "src/app/api/invoices/[id]/payments"
if (!(Test-Path $path)) { New-Item -ItemType Directory -Force -Path $path }
$code = @"
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Return payment logs for this invoice
    // You can tie this to a Payment table in Prisma if you expand schema later
    const mockPayments = [
      { id: "pay_1", invoiceId: params.id, amount: 1500.00, method: "Stripe", createdAt: new Date() }
    ];
    return NextResponse.json(mockPayments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
"@
Set-Content -Path "src/app/api/invoices/[id]/payments/route.ts" -Value $code -Encoding utf8