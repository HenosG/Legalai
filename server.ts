import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { clerkMiddleware } from "@clerk/express";
import { prisma } from "./server/lib/prisma.js";


import clerkWebhookRouter from "./server/clerk-webhook.js";
import stripeWebhookRouter from "./server/routes/stripe-webhook.js";
import * as subscriptionModule from "./server/routes/subscriptions.js";
import checkoutRouter from "./server/routes/checkout.js";
import contactRouter from "./server/routes/contact.js";
import contactMessagesRouter from "./server/routes/contactMessages.js";
import onboardingRouter from "./src/routes/onboarding.js";
import clientsRouter from "./src/server/routes/clients.js";
import aiIntakeRouter from "./server/routes/aiIntake.js";
import proposalsRouter from "./server/routes/proposals.js";
import projectRoutes from "./server/routes/projects.js";
import tasksRouter from "./server/routes/tasks.js";
import milestonesRouter from "./server/routes/milestones.js";
import settingsRouter from "./server/routes/settings.js";

// ─── Invoice / Stripe Connect routes (new) ────────────────────────────────────
// Separate from the RelunoOS subscription checkout (checkoutRouter) and
// subscription webhook (stripeWebhookRouter) above — nothing below touches
// those. This is each agency's OWN connected Stripe account, used to collect
// payment on their own client invoices.
import invoicesRouter from "./server/routes/invoices.js";
import stripeConnectRouter from "./src/routes/stripeConnect.js";
import stripeConnectWebhookRouter from "./stripeConnectWebhook.js";


dotenv.config();


// ─── Initialization ──────────────────────────────────────────────────────────


const app = express();
const PORT = Number(process.env.PORT || 5000);


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});


const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || ""
);


const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});


const subscriptionRouter = subscriptionModule.default;


app.set("stripe", stripe);


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
    "⚠️ WARNING: Gemini API Key is missing. Set GEMINI_API_KEY."
  );
}


if (!process.env.CONTACT_ADMIN_CLERK_USER_IDS) {
  console.warn(
    "⚠️ WARNING: CONTACT_ADMIN_CLERK_USER_IDS is missing. Contact inbox access will remain blocked."
  );
}

if (!process.env.STRIPE_CONNECT_WEBHOOK_SECRET) {
  console.warn(
    "⚠️ WARNING: STRIPE_CONNECT_WEBHOOK_SECRET is missing. Invoice payment webhooks will fail signature verification."
  );
}


// ─── CORS ────────────────────────────────────────────────────────────────────


const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];


app.use((req, res, next) => {
  const origin = req.headers.origin;


  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
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
    return res.sendStatus(204);
  }


  return next();
});


// ─── Clerk Middleware ────────────────────────────────────────────────────────


app.use(clerkMiddleware());


// ─── Webhooks ────────────────────────────────────────────────────────────────
// Webhook routes must be mounted before express.json().
// Stripe and Clerk need the unparsed raw body for signature verification.


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

// Stripe Connect invoice-payment webhook — separate path, separate signing
// secret (STRIPE_CONNECT_WEBHOOK_SECRET), separate handler file. Does not
// touch /api/stripe/webhook (subscriptions) above.
app.use(
  "/api/stripe-connect/webhook",
  express.raw({ type: "application/json" }),
  stripeConnectWebhookRouter
);


// ─── JSON Body Parser ────────────────────────────────────────────────────────


app.use(express.json({ limit: "1mb" }));


// ─── Health ──────────────────────────────────────────────────────────────────


app.get("/api/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});


// ─── Main API Routes ─────────────────────────────────────────────────────────


console.log("--- Initializing Routes ---");


app.use("/api/user", subscriptionRouter);
app.use("/api/stripe", checkoutRouter);


/*
  Public marketing-site contact form.


  POST /api/contact


  This is intentionally public. Visitors should not need an account
  to contact RelunoOS.
*/
app.use("/api/contact", contactRouter);


/*
  Private internal contact inbox.


  GET   /api/contact-messages
  PATCH /api/contact-messages/:id/read


  Clerk authentication and admin authorization are enforced inside
  server/routes/contactMessages.ts through requireContactAdmin.
*/
app.use("/api/contact-messages", contactMessagesRouter);


app.use("/api/onboarding", onboardingRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/ai-intake", aiIntakeRouter);
app.use("/api/proposals", proposalsRouter);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", tasksRouter);
app.use("/api/milestones", milestonesRouter);


/**
 * Settings routes:
 * GET   /api/settings
 * PATCH /api/settings/workspace
 * GET   /api/settings/client-portal
 * PATCH /api/settings/client-portal
 */
app.use("/api/settings", settingsRouter);

/**
 * Invoice routes:
 * GET    /api/invoices
 * GET    /api/invoices/:id
 * POST   /api/invoices
 * PATCH  /api/invoices/:id
 * POST   /api/invoices/:id/issue
 * POST   /api/invoices/:id/payment-session
 */
app.use("/api/invoices", invoicesRouter);

/**
 * Stripe Connect onboarding routes (separate from subscription billing):
 * POST /api/stripe-connect/onboarding-link
 * GET  /api/stripe-connect/status
 */
app.use("/api/stripe-connect", stripeConnectRouter);


// ─── Dashboard Metrics API ───────────────────────────────────────────────────


app.get("/api/dashboard/metrics", async (req: any, res) => {
  try {
    const auth =
      req.auth && typeof req.auth === "function" ? req.auth() : req.auth;


    const userId = auth?.userId || (req.query.userId as string);


    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
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


    return res.status(200).json({
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
      return res.status(401).json({
        error: "Unauthorized",
      });
    }


    const activities = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 100),
    });


    return res.status(200).json({
      activities,
    });
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
      return res.status(401).json({
        error: "Unauthorized",
      });
    }


    const { prompt } = req.body;


    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }


    const result = await model.generateContent(prompt);
    const responseText = result.response.text();


    return res.status(200).json({
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
      return res.status(401).json({
        error: "Unauthorized",
      });
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


    return res.status(200).json({
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


// ─── Project AI Copilot API ──────────────────────────────────────────────────


app.post(
  "/api/projects/:projectId/ai-insights",
  async (req: any, res) => {
    try {
      const auth =
        req.auth && typeof req.auth === "function"
          ? req.auth()
          : req.auth;


      const userId = auth?.userId || (req.query.userId as string);


      if (!userId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }


      const { projectId } = req.params;


      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId,
        },
        include: {
          client: {
            select: {
              name: true,
              company: true,
            },
          },
          milestones: {
            select: {
              id: true,
              title: true,
              status: true,
              dueDate: true,
              amount: true,
            },
          },
          tasks: {
            select: {
              id: true,
              title: true,
              status: true,
              priority: true,
              dueDate: true,
              estimatedHours: true,
              actualHours: true,
              milestoneId: true,
            },
          },
        },
      });


      if (!project) {
        return res.status(404).json({
          error: "Project not found",
        });
      }


      const projectContext = {
        name: project.name,
        description: project.description,
        status: project.status,
        health: project.health,
        progress: project.progress,
        budget: project.budget,
        currency: project.currency,
        startDate: project.startDate,
        targetDate: project.targetDate,
        client: project.client,
        milestones: project.milestones,
        tasks: project.tasks,
      };


      const prompt = `
You are the AI Delivery Copilot for RelunoOS, an agency operations platform.


Analyze this client project and return ONLY valid JSON. Do not include markdown, explanations, or code fences.


Return this exact JSON structure:
{
  "summary": "A concise 2-3 sentence delivery assessment.",
  "healthScore": 0-100,
  "risks": ["Specific delivery risks"],
  "nextSteps": ["Specific, actionable next steps"],
  "recommendedTasks": ["Specific tasks that should be added if useful"]
}


Consider:
- Project progress and completion percentage
- Task status distribution: DONE, IN_PROGRESS, IN_REVIEW, TODO, CANCELLED
- Overdue or upcoming task due dates
- Project target date and remaining time
- Milestone coverage and missing work
- Budget versus estimated delivery effort
- Scope clarity and client-approval risks


Project data:
${JSON.stringify(projectContext, null, 2)}
`;


      const result = await model.generateContent(prompt);
      const text = result.response.text();


      const jsonMatch = text.match(/\{[\s\S]*\}/);


      if (!jsonMatch) {
        throw new Error("AI did not return valid JSON");
      }


      const aiData = JSON.parse(jsonMatch[0]);


      const savedInsight = await prisma.projectAiInsight.create({
        data: {
          projectId: project.id,
          summary: aiData.summary || "AI review completed.",
          risks: Array.isArray(aiData.risks) ? aiData.risks : [],
          nextSteps: Array.isArray(aiData.nextSteps)
            ? aiData.nextSteps
            : [],
          healthScore:
            typeof aiData.healthScore === "number"
              ? Math.max(0, Math.min(100, aiData.healthScore))
              : null,
          model: "gemini-2.5-flash",
        },
      });


      return res.status(200).json({
        id: savedInsight.id,
        summary: savedInsight.summary,
        risks: savedInsight.risks,
        nextSteps: savedInsight.nextSteps,
        healthScore: savedInsight.healthScore,
        recommendedTasks: aiData.recommendedTasks || [],
        createdAt: savedInsight.createdAt,
      });
    } catch (error: any) {
      console.error(
        "❌ Project AI insights error:",
        error?.message || error
      );


      return res.status(500).json({
        error: "Failed to generate AI project insights",
      });
    }
  }
);


// ─── Project AI Insights History API ─────────────────────────────────────────


app.get(
  "/api/projects/:projectId/ai-insights",
  async (req: any, res) => {
    try {
      const auth =
        req.auth && typeof req.auth === "function"
          ? req.auth()
          : req.auth;


      const userId = auth?.userId || (req.query.userId as string);


      if (!userId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }


      const { projectId } = req.params;


      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId,
        },
        select: {
          id: true,
        },
      });


      if (!project) {
        return res.status(404).json({
          error: "Project not found",
        });
      }


      const insights = await prisma.projectAiInsight.findMany({
        where: {
          projectId: project.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      });


      return res.status(200).json({
        insights,
      });
    } catch (error: any) {
      console.error(
        "❌ Project AI insights history error:",
        error?.message || error
      );


      return res.status(500).json({
        error: "Failed to fetch AI project insights",
      });
    }
  }
);


// ─── Templates API ───────────────────────────────────────────────────────────


app.get("/api/templates", async (_req, res) => {
  try {
    const templates = await prisma.proposalTemplate.findMany();


    return res.status(200).json(templates);
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


    return res.status(200).json({
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


    return res.status(200).json(user);
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


// ─── Graceful Shutdown ───────────────────────────────────────────────────────


async function shutdown(signal: string) {
  console.log(`${signal} received. Disconnecting Prisma.`);


  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error("Error while disconnecting Prisma:", error);
  } finally {
    process.exit(0);
  }
}


process.on("SIGINT", () => {
  void shutdown("SIGINT");
});


process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});


// ─── Start Server ────────────────────────────────────────────────────────────


console.log("🚀 Initializing database connection...");


prisma
  .$connect()
  .then(() => {
    console.log("✅ Database connected successfully via Prisma.");


    app.listen(PORT, () => {
      console.log(`✅ Reluno server active on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to the database on startup:", error);
    process.exit(1);
  });