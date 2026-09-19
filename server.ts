// server.ts
import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { clerkMiddleware } from '@clerk/express';
import { PrismaClient } from '@prisma/client';


dotenv.config();


// --- Initialization ---
const app = express();
const PORT = process.env.PORT || 5000;


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
const prisma = new PrismaClient();


app.set('stripe', stripe);


// --- Imports ---
import clerkWebhookRouter from './server/clerk-webhook.js';
import tasksRouter from './server/routes/tasks.js';
import stripeWebhookRouter from './server/routes/stripe-webhook.js';
import * as subscriptionModule from './server/routes/subscriptions.js';
import checkoutRouter from './server/routes/checkout.js';
import contactRouter from './server/routes/contact.js';
import onboardingRouter from "./src/routes/onboarding.js";
import clientsRouter from './src/server/routes/clients.js';
import aiIntakeRouter from './server/routes/aiIntent.ts'; // 👈 AI Intake routes import
import aiAssistantRouter from './src/server/routes/ai-assistant.ts';
const subscriptionRouter = subscriptionModule.default;


// --- Validation Logic ---
const REQUIRED_ENV = ['VITE_GEMINI_API_KEY', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'CLERK_SECRET_KEY', 'DATABASE_URL'];
REQUIRED_ENV.forEach(key => { if (!process.env[key]) console.warn(`⚠️ WARNING: ${key} is missing!`); });


// --- CORS & Middleware ---
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const ALLOWED_ORIGINS = ['http://localhost:8080', 'http://localhost:5173', 'http://127.0.0.1:8080', process.env.CLIENT_URL].filter(Boolean);
  if (origin && ALLOWED_ORIGINS.includes(origin)) res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});


// ✅ Initialize Clerk middleware globally ONCE (after CORS, before routes)
app.use(clerkMiddleware());


// --- Specialized Routes (Webhooks require raw body) ---
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhookRouter);
app.use('/api/webhooks/clerk', express.raw({ type: 'application/json' }), clerkWebhookRouter);


// --- JSON Parser ---
app.use(express.json({ limit: '50mb' }));


// --- API Health ---
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));


// --- Route Registration ---
console.log("--- Initializing Routes ---");
app.use('/api/user', subscriptionRouter);
app.use('/api/stripe', checkoutRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/contact', contactRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/ai-intake', aiIntakeRouter); // 👈 AI Intake route registration
app.use('/api/ai-assistant', aiAssistantRouter); // 👈 NEW: AI Assistant route registration


// --- Dashboard Metrics API ---
app.get('/api/dashboard/metrics', async (req: any, res) => {
  try {
    const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
    const userId = auth?.userId || req.query.userId as string;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [clientCount, proposalCount, projectCount, invoiceStats] = await Promise.all([
      prisma.client.count({ where: { userId } }),
      prisma.proposal.count({ where: { userId, status: "OPEN" } }),
      prisma.project.count({ where: { userId, status: "IN_PROGRESS" } }),
      prisma.invoice.aggregate({
        where: { userId, status: { not: "PAID" } },
        _sum: { amount: true },
      })
    ]);

    res.json({
      activeClients: clientCount,
      openProposals: proposalCount,
      activeProjects: projectCount,
      outstandingInvoices: invoiceStats._sum.amount || 0,
      monthlyRevenue: 0,
      pipelineValue: 0
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ error: "Failed to fetch dashboard metrics" });
  }
});


// --- Dashboard Activity Feed API ---
app.get('/api/dashboard/activity', async (req: any, res) => {
  try {
    const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
    const userId = auth?.userId || req.query.userId as string;
    const limit = parseInt(req.query.limit as string) || 20;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const activities = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit
    });

    res.json({ activities });
  } catch (error) {
    console.error("Error fetching activity feed:", error);
    res.status(500).json({ error: "Failed to fetch activity feed" });
  }
});


// --- AI Query API Endpoint (OLD - Keep for backwards compatibility) ---
app.post('/api/ai/query', async (req: any, res) => {
  try {
    const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
    const userId = auth?.userId || req.query.userId as string;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ success: true, reply: responseText });
  } catch (error: any) {
    console.error("❌ AI Query Error:", error.message);
    res.status(500).json({ error: "Failed to process AI query", details: error.message });
  }
});


// --- NEW: AI Assistant Endpoint (Internal Agency Queries) ---
app.post('/api/ai-assistant', async (req: any, res) => {
  try {
    const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
    const userId = auth?.userId || req.query.userId as string;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const lowerQuery = query.toLowerCase();

    // Example: "Show me active clients"
    if (lowerQuery.includes('active client') || lowerQuery.includes('clients')) {
      const clients = await prisma.client.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      
      return res.json({
        type: 'client_list',
        data: clients,
        message: `Found ${clients.length} clients`,
      });
    }

    // Example: "What is total outstanding invoice amount"
    if (lowerQuery.includes('invoice') || lowerQuery.includes('revenue')) {
      const invoices = await prisma.invoice.findMany({
        where: { userId },
      });
      
      const total = invoices.reduce((sum: number, inv: any) => sum + inv.amount, 0);
      const paid = invoices.filter((inv: any) => inv.status === 'PAID').reduce((sum: number, inv: any) => sum + inv.amount, 0);
      const unpaid = invoices.filter((inv: any) => inv.status !== 'PAID').reduce((sum: number, inv: any) => sum + inv.amount, 0);
      
      return res.json({
        type: 'invoice_summary',
        data: { total, paid, unpaid, count: invoices.length },
        message: `Total: $${total.toLocaleString()} (Paid: $${paid.toLocaleString()}, Unpaid: $${unpaid.toLocaleString()})`,
      });
    }

    // Example: "Show me my projects"
    if (lowerQuery.includes('project')) {
      const projects = await prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      
      return res.json({
        type: 'project_list',
        data: projects,
        message: `Found ${projects.length} projects`,
      });
    }

    // Default: Use AI to generate response
    const result = await model.generateContent(`Answer this agency management query concisely: ${query}`);
    const responseText = result.response.text();

    return res.json({
      type: 'ai_response',
      data: { 
        message: responseText,
        suggestions: [
          'Show me active clients',
          'What is total revenue',
          'List my projects',
        ],
      },
    });
  } catch (error: any) {
    console.error("❌ AI Assistant Error:", error.message);
    res.status(500).json({ error: "Failed to process internal query", details: error.message });
  }
});


// --- Templates API ---
app.get('/api/templates', async (_req, res) => {
  try {
    const templates = await prisma.proposalTemplate.findMany();
    res.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});


// --- Webinar Access Request API ---
app.post('/api/webinars/request-access', async (req, res) => {
  const { email, fullName, company, jobTitle, useCase, message } = req.body;

  if (!email || !fullName || !useCase) {
    return res.status(400).json({ error: 'Missing required fields: email, fullName, useCase' });
  }

  try {
    const newRequest = await prisma.webinarAccessRequest.create({
      data: { email, fullName, company, jobTitle, useCase, message },
    });
    res.status(201).json({ message: 'Access request submitted successfully', id: newRequest.id });
  } catch (error: any) {
    console.error('❌ WEBINAR ACCESS ERROR:', error.message);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'An access request with this email already exists.' });
    }
    res.status(500).json({ error: 'Failed to submit request', details: error.message });
  }
});


// --- PDF AI Analysis Logic ---
app.post('/api/pdf-analysis', async (req, res) => {
  console.log(`\n🔍 Analyzing: ${req.body.filename}`);
  try {
    const prompt = `Analyze this legal document and return ONLY a raw JSON object. Format: {"riskScore": number, "riskLevel": "low"|"medium"|"high"|"critical", "summary": "string", "keyRisks": ["string"]}. Text: ${req.body.content.substring(0, 8000)}`;
    const result = await model.generateContent(prompt);
    const aiData = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)![0]);
    res.json({ id: 'ai-' + Date.now(), filename: req.body.filename, ...aiData, clauses: [], createdAt: new Date().toISOString() });
  } catch (error: any) {
    console.error('❌ SERVER ERROR:', error.message);
    res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
});


// --- Quick User Lookup / Upsert Route (Fixes email 404) ---
app.get('/api/user/:identifier', async (req: any, res) => {
  try {
    const identifier = req.params.identifier;
    
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: identifier },
          { email: identifier }
        ]
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: identifier.includes('@') ? `user_gen_${Date.now()}` : identifier,
          email: identifier.includes('@') ? identifier : `${identifier}@placeholder.com`,
          plan: 'free'
        }
      });
    }

    res.json(user);
  } catch (error: any) {
    console.error("❌ User lookup error:", error.message);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});


// --- Catch-All (404) ---
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));


app.listen(PORT, () => {
  console.log(`✅ Reluno server active on port ${PORT}`);
});