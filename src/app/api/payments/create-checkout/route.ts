import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { invoiceId, amount } = await request.json();

    // Simulated Stripe Checkout URL redirection for development
    // In production, integrate Stripe SDK: stripe.checkout.sessions.create(...)
    const mockCheckoutUrl = `/invoices/${invoiceId}/pay?success=true`;

    return NextResponse.json({ url: mockCheckoutUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}