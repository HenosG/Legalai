import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { clerkMiddleware } from "@clerk/express";
import { PrismaClient } from "@prisma/client";

dotenv.config();

// ─── Initialization ──────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 5000;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || ""
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const prisma = new PrismaClient();

app.set("stripe", stripe);

// ─── Route Imports ───────────────────────────────────────────────────────────

import clerkWebhookRouter from "./server/clerk-webhook.js";
import stripeWebhookRouter from "./server/routes/stripe-webhook.js";
import * as subscriptionModule from "./server/routes/subscriptions.js";
import checkoutRouter from "./server/routes/checkout.js";
import contactRouter from "./server/routes/contact.js";
import onboardingRouter from "./src/routes/onboarding.js";
import clientsRouter from "./src/server/routes/clients.js";
import aiIntakeRouter from "./server/routes/aiIntake";
import proposalsRouter from "./server/routes/proposals.js";
import projectRoutes from "./server/routes/projects.js";
import tasksRouter from "./server/routes/tasks.js";
import milestonesRouter from "./server/routes/milestones.js";
import settingsRouter from "./server/routes/settings.js";

const subscriptionRouter = subscriptionModule.default;

// ─── Environment Validation ──────────────────────────────────────────────────

const REQUIRED_ENV = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "CLERK_SECRET_KEY",
  "DATABASE_URL",
];

REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ WARNING: ${key} is missing!`);
  }
});

if (!process.env.GEMINI_API_KEY && !process.env.VITE_GEMINI_API_KEY) {
  console.warn(
    "⚠️ WARNING: Gemini API Key is missing! Set GEMINI_API_KEY or VITE_GEMINI_API_KEY."
  );
}

// ─── CORS ────────────────────────────────────────────────────────────────────

app.use((req, res, next) => {
  const origin = req.headers.origin;

  const allowedOrigins = [
    "http://localhost:8080",
    "http://localhost:5173",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL,
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ─── Clerk Middleware ────────────────────────────────────────────────────────

app.use(clerkMiddleware());

// ─── Webhook Routes ──────────────────────────────────────────────────────────
// These routes must receive raw request bodies before express.json().

app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookRouter
);

app.use(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhookRouter
);

// ─── JSON Body Parser ────────────────────────────────────────────────────────

app.use(express.json({ limit: "50mb" }));

// ─── Health ──────────────────────────────────────────────────────────────────

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ─── Main API Routes ─────────────────────────────────────────────────────────

console.log("--- Initializing Routes ---");

app.use("/api/user", subscriptionRouter);
app.use("/api/stripe", checkoutRouter);
app.use("/api/contact", contactRouter);
app.use("/api/onboarding", onboardingRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/ai-intake", aiIntakeRouter);
app.use("/api/proposals", proposalsRouter);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", tasksRouter);
app.use("/api/milestones", milestonesRouter);

/**
 * Settings endpoints:
 * GET   /api/settings
 * PATCH /api/settings/workspace
 * GET   /api/settings/client-portal
 * PATCH /api/settings/client-portal
 */
app.use("/api/settings", settingsRouter);

// ─── Dashboard Metrics API ───────────────────────────────────────────────────

app.get("/api/dashboard/metrics", async (req: any, res) => {
  try {
    const auth =
      req.auth && typeof req.auth === "function" ? req.auth() : req.auth;

    const userId = auth?.userId || (req.query.userId as string);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [clientCount, proposalCount, projectCount, invoiceStats] =
      await Promise.all([
        prisma.client.count({
          where: { userId },
        }),
        prisma.proposal.count({
          where: {
            userId,
            status: "OPEN",
          },
        }),
        prisma.project.count({
          where: {
            userId,
            status: "ACTIVE",
          },
        }),
        prisma.invoice.aggregate({
          where: {
            userId,
            status: {
              not: "PAID",
            },
          },
          _sum: {
            amount: true,
          },
        }),
      ]);

    return res.json({
      activeClients: clientCount,
      openProposals: proposalCount,
      activeProjects: projectCount,
      outstandingInvoices: invoiceStats._sum.amount || 0,
      monthlyRevenue: 0,
      pipelineValue: 0,
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);

    return res.status(500).json({
      error: "Failed to fetch dashboard metrics",
    });
  }
});

// ─── Dashboard Activity API ──────────────────────────────────────────────────

app.get("/api/dashboard/activity", async (req: any, res) => {
  try {
    const auth =
      req.auth && typeof req.auth === "function" ? req.auth() : req.auth;

    const userId = auth?.userId || (req.query.userId as string);
    const limit = Number.parseInt(req.query.limit as string, 10) || 20;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const activities = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 100),
    });

    return res.json({ activities });
  } catch (error) {
    console.error("Error fetching activity feed:", error);

    return res.status(500).json({
      error: "Failed to fetch activity feed",
    });
  }
});

// ─── AI Query API ────────────────────────────────────────────────────────────

app.post("/api/ai/query", async (req: any, res) => {
  try {
    const auth =
      req.auth && typeof req.auth === "function" ? req.auth() : req.auth;

    const userId = auth?.userId || (req.query.userId as string);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return res.json({
      success: true,
      reply: responseText,
    });
  } catch (error: any) {
    console.error("❌ AI Query Error:", error?.message || error);

    return res.status(500).json({
      error: "Failed to process AI query",
    });
  }
});

// ─── Autonomous AI Assistant API ─────────────────────────────────────────────

app.post("/api/ai-assistant", async (req: any, res) => {
  try {
    const auth =
      req.auth && typeof req.auth === "function" ? req.auth() : req.auth;

    const userId = auth?.userId || (req.query.userId as string);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        error: "Query is required",
      });
    }

    const autonomousPrompt = `
You are the core intelligence of RelunoOS, an agency management platform.

The user is asking:
"${query}"

Available data entities:
- Client: { id, name, company, email, phone, status, createdAt }
- Project: { id, name, description, status, budget, userId, createdAt }
- Invoice: { id, amount, status, dueDate, userId, createdAt }
- Proposal: { id, title, status, amount, userId, createdAt }

Analyze the user's intent. Decide which table should be queried and extract any meaningful search term.

Return ONLY valid JSON. Do not include markdown.

{
  "primaryTable": "client" | "project" | "invoice" | "proposal" | "none",
  "action": "findMany" | "aggregate" | "count" | "none",
  "searchTerm": "string or null",
  "cardType": "client_list" | "project_list" | "invoice_summary" | "ai_response",
  "instructions": "Instructions for generating a personalized response using the retrieved records."
}
`;

    const classificationResult =
      await model.generateContent(autonomousPrompt);

    const textResponse = classificationResult.response.text();

    const cleanJsonText = textResponse
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const plan = JSON.parse(cleanJsonText);

    let fetchedData: unknown = null;

    if (plan.primaryTable === "client") {
      const where: any = { userId };

      if (plan.searchTerm) {
        where.OR = [
          {
            name: {
              contains: plan.searchTerm,
              mode: "insensitive",
            },
          },
          {
            company: {
              contains: plan.searchTerm,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: plan.searchTerm,
              mode: "insensitive",
            },
          },
        ];
      }

      fetchedData = await prisma.client.findMany({
        where,
        take: 10,
        orderBy: { createdAt: "desc" },
      });
    } else if (plan.primaryTable === "project") {
      const where: any = { userId };

      if (plan.searchTerm) {
        where.name = {
          contains: plan.searchTerm,
          mode: "insensitive",
        };
      }

      fetchedData = await prisma.project.findMany({
        where,
        take: 10,
        orderBy: { createdAt: "desc" },
      });
    } else if (plan.primaryTable === "invoice") {
      const invoices = await prisma.invoice.findMany({
        where: { userId },
      });

      const total = invoices.reduce(
        (sum, invoice) => sum + (invoice.amount || 0),
        0
      );

      const paid = invoices
        .filter((invoice) => invoice.status?.toUpperCase() === "PAID")
        .reduce((sum, invoice) => sum + (invoice.amount || 0), 0);

      fetchedData = {
        total,
        paid,
        unpaid: total - paid,
        count: invoices.length,
      };
    } else if (plan.primaryTable === "proposal") {
      const where: any = { userId };

      if (plan.searchTerm) {
        where.title = {
          contains: plan.searchTerm,
          mode: "insensitive",
        };
      }

      fetchedData = await prisma.proposal.findMany({
        where,
        take: 10,
        orderBy: { createdAt: "desc" },
      });
    }

    const synthesisPrompt = `
User query:
"${query}"

Retrieved records:
${JSON.stringify(fetchedData)}

Assistant instructions:
${plan.instructions || "Provide a helpful response based on the records."}

Write a helpful, professional, concise but informative response. Use only facts found in the retrieved records. If no relevant records are available, state that clearly.
`;

    const synthesisResult = await model.generateContent(synthesisPrompt);

    return res.json({
      type: plan.cardType || "ai_response",
      message: synthesisResult.response.text(),
      data: fetchedData,
    });
  } catch (error: any) {
    console.error(
      "❌ Autonomous AI Assistant Error:",
      error?.message || error
    );

    return res.status(500).json({
      type: "ai_response",
      message: "An error occurred while processing your request.",
    });
  }
});

// ─── Templates API ───────────────────────────────────────────────────────────

app.get("/api/templates", async (_req, res) => {
  try {
    const templates = await prisma.proposalTemplate.findMany();

    return res.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);

    return res.status(500).json({
      error: "Failed to fetch templates",
    });
  }
});

// ─── Webinar Access Request API ──────────────────────────────────────────────

app.post("/api/webinars/request-access", async (req, res) => {
  const { email, fullName, company, jobTitle, useCase, message } = req.body;

  if (!email || !fullName || !useCase) {
    return res.status(400).json({
      error: "Missing required fields: email, fullName, useCase",
    });
  }

  try {
    const newRequest = await prisma.webinarAccessRequest.create({
      data: {
        email,
        fullName,
        company,
        jobTitle,
        useCase,
        message,
      },
    });

    return res.status(201).json({
      message: "Access request submitted successfully",
      id: newRequest.id,
    });
  } catch (error: any) {
    console.error("❌ WEBINAR ACCESS ERROR:", error?.message || error);

    if (error?.code === "P2002") {
      return res.status(409).json({
        error: "An access request with this email already exists.",
      });
    }

    return res.status(500).json({
      error: "Failed to submit request",
    });
  }
});

// ─── PDF AI Analysis API ─────────────────────────────────────────────────────

app.post("/api/pdf-analysis", async (req, res) => {
  try {
    const filename =
      typeof req.body?.filename === "string"
        ? req.body.filename
        : "Untitled document";

    const content =
      typeof req.body?.content === "string" ? req.body.content : "";

    if (!content) {
      return res.status(400).json({
        error: "Document content is required",
      });
    }

    console.log(`\n🔍 Analyzing: ${filename}`);

    const prompt = `
Analyze this legal document and return ONLY raw JSON.

Format:
{
  "riskScore": number,
  "riskLevel": "low" | "medium" | "high" | "critical",
  "summary": "string",
  "keyRisks": ["string"]
}

Document text:
${content.substring(0, 8000)}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON");
    }

    const aiData = JSON.parse(jsonMatch[0]);

    return res.json({
      id: `ai-${Date.now()}`,
      filename,
      ...aiData,
      clauses: [],
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ PDF ANALYSIS ERROR:", error?.message || error);

    return res.status(500).json({
      error: "Analysis failed",
    });
  }
});

// ─── Quick User Lookup / Upsert ──────────────────────────────────────────────

app.get("/api/user/:identifier", async (req: any, res) => {
  try {
    const identifier = req.params.identifier as string;

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ id: identifier }, { email: identifier }],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: identifier.includes("@")
            ? `user_gen_${Date.now()}`
            : identifier,
          email: identifier.includes("@")
            ? identifier
            : `${identifier}@placeholder.com`,
          plan: "free",
        },
      });
    }

    return res.json(user);
  } catch (error: any) {
    console.error("❌ User lookup error:", error?.message || error);

    return res.status(500).json({
      error: "Failed to fetch user profile",
    });
  }
});

// ─── 404 ─────────────────────────────────────────────────────────────────────

app.use((_req, res) => {
  return res.status(404).json({
    error: "Route not found",
  });
});

// ─── Start Server ────────────────────────────────────────────────────────────

console.log("🚀 Initializing database connection...");

prisma
  .$connect()
  .then(() => {
    console.log("✅ Database connected successfully via Prisma.");

    app.listen(Number(PORT), () => {
      console.log(`✅ Reluno server active on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to the database on startup:", error);
    process.exit(1);
  });