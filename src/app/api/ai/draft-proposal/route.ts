import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const draftedScope = `# Project Proposal: ${prompt}

## 1. Executive Summary
This document outlines professional engineering and development services for ${prompt}.

## 2. Scope of Work & Deliverables
- Full-stack system architecture design and database schema configuration (Prisma/PostgreSQL).
- Secure user authentication and role-based permissions.
- Modern, responsive user interface using Tailwind CSS and shadcn/ui components.
- Payment gateway integration and secure webhooks setup.

## 3. Timeline & Milestones
- Phase 1: Architecture & Foundation (1 Week)
- Phase 2: Core Feature Implementation (2 Weeks)
- Phase 3: Testing & Production Deployment (1 Week)

Total Estimated Investment: $7,500 CAD`;

    return NextResponse.json({
      scope: draftedScope,
      amount: 7500.0,
    });
  } catch (error) {
    console.error("AI proposal drafting error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}