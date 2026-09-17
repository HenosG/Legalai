import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Load all templates
export async function GET() {
  const templates = await prisma.template.findMany();
  return NextResponse.json(templates);
}

// POST: Save or Update a document from the editor
export async function POST(req: Request) {
  const { id, title, content, category, complexity } = await req.json();
  
  const template = await prisma.template.upsert({
    where: { id: id || "new-id" },
    update: { title, content, category, complexity },
    create: { title, content, category, complexity },
  });
  
  return NextResponse.json(template);
}