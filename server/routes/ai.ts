import { GoogleGenAI } from "@google/genai";
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Initialize the Google Gen AI client using your environment variable API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/ai-assistant", async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    
    if (!query || typeof query !== "string") {
      return res.status(400).json({ 
        type: "ai_response", 
        message: "Please provide a valid query string." 
      });
    }

    // 1. Use Gemini to semantically analyze the user's intent and map it to an action
    const prompt = `
      You are the intelligent assistant for RelunoOS, an agency management operating system.
      Analyze this user query from an agency owner: "${query}"
      
      Determine what data or action the user wants. Classify it into one of these exact types:
      - "invoice_summary": if they ask about money made, revenue, earnings, paid/unpaid invoices, or financial totals.
      - "client_list": if they ask about clients, customers, who is signed, or account lists.
      - "project_list": if they ask about projects, active work, delivery statuses, or project budgets.
      - "ai_response": for general questions, drafting text, or anything that doesn't fit the structured lists above.

      Return ONLY a valid JSON object in this exact structure (no markdown formatting around it, just raw JSON):
      {
        "type": "invoice_summary" | "client_list" | "project_list" | "ai_response",
        "message": "A professional, friendly confirmation or summary answering the prompt"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { 
        responseMimeType: "application/json" 
      }
    });

    const responseText = response.text();
    if (!responseText) {
      throw new Error("No response received from Gemini model.");
    }

    const parsed = JSON.parse(responseText);

    // 2. Fetch live data from your database based on Gemini's classification
    let data = null;

    if (parsed.type === "invoice_summary") {
      const invoices = await prisma.invoice.findMany();
      const total = invoices.reduce((acc: number, inv: any) => acc + (inv.amount || 0), 0);
      const paid = invoices
        .filter((inv: any) => inv.status?.toUpperCase() === "PAID")
        .reduce((acc: number, inv: any) => acc + (inv.amount || 0), 0);
      const unpaid = total - paid;
      
      data = { total, paid, unpaid };
    } 
    else if (parsed.type === "client_list") {
      data = await prisma.client.findMany({
        take: 10,
        select: { id: true, name: true, email: true, company: true, status: true },
        orderBy: { createdAt: "desc" }
      });
    } 
    else if (parsed.type === "project_list") {
      data = await prisma.project.findMany({
        take: 10,
        select: { id: true, name: true, budget: true, status: true },
        orderBy: { createdAt: "desc" }
      });
    }

    return res.json({
      type: parsed.type,
      message: parsed.message,
      data: data
    });

  } catch (error) {
    console.error("AI Assistant Route Error:", error);
    return res.status(500).json({ 
      type: "ai_response", 
      message: "I encountered an error connecting to Gemini or your database. Please try again." 
    });
  }
});

export default router;