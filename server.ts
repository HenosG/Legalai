// server.ts
import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { clerkMiddleware } from '@clerk/express';
import { PrismaClient } from '@prisma/client';

// --- Imports ---
import clerkWebhookRouter from './server/clerk-webhook.js';
import tasksRouter from './server/routes/tasks.js';
import stripeWebhookRouter from './server/routes/stripe-webhook.js';
import * as subscriptionModule from './server/routes/subscriptions.js';
import checkoutRouter from './server/routes/checkout.js';
import contactRouter from './server/routes/contact.js';
const subscriptionRouter = subscriptionModule.default;

dotenv.config();

// --- Initialization ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

app.set('stripe', stripe);

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

// ✅ Initialize Clerk middleware FIRST (global auth - NO MANUAL CHECK)
app.use(clerkMiddleware());

// --- Specialized Routes (Webhooks) ---
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


// --- Templates API ---
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await prisma.template.findMany();
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
      data: {
        email,
        fullName,
        company,
        jobTitle,
        useCase,
        message,
      },
    });
    
    // Email sending is disabled per user request
    
    res.status(201).json({ 
      message: 'Access request submitted successfully', 
      id: newRequest.id 
    });
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

// --- Catch-All (404) ---
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// --- List Endpoints ---
console.log("\n--- REGISTERED ROUTES ---");
console.log([
  '/api/health',
  '/api/stripe/webhook',
  '/api/webhooks/clerk',
  '/api/user',
  '/api/stripe',
  '/api/tasks',
  '/api/pdf-analysis',
  '/api/templates',
  '/api/contact',
  '/api/webinars/request-access',
]);
console.log("-------------------------\n");

app.listen(PORT, () => {
  console.log(`✅ Reluno server active on port ${PORT}`);
});
