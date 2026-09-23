import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();
const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// --- 1. Get all AI Intakes ---
router.get('/', async (req: any, res) => {
  try {
    const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
    const userId = auth?.userId || req.query.userId;
    const searchQuery = req.query.query as string;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const where: any = { userId };
    if (searchQuery) {
      where.OR = [
        { contactName: { contains: searchQuery, mode: 'insensitive' } },
        { email: { contains: searchQuery, mode: 'insensitive' } },
        { company: { contains: searchQuery, mode: 'insensitive' } },
        { projectType: { contains: searchQuery, mode: 'insensitive' } }
      ];
    }

    const intakes = await prisma.aIIntake.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({ intakes });
  } catch (error: any) {
    console.error("❌ Error fetching AI intakes:", error.message);
    res.status(500).json({ error: "Failed to fetch AI intakes", details: error.message });
  }
});

// --- 2. Activity Feed Endpoint ---
router.get('/activity', async (req: any, res) => {
  try {
    const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
    const userId = auth?.userId || req.query.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const activities = await prisma.activityLog.findMany({
      where: { 
        userId,
        action: { contains: 'INTAKE' }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    res.json({ activities });
  } catch (error: any) {
    console.error("❌ Error fetching intake activity feed:", error.message);
    res.status(500).json({ error: "Failed to fetch activity feed", details: error.message });
  }
});

// --- 3. Get Single AI Intake Detail (Mapped for Frontend UI) ---
router.get('/:id', async (req: any, res) => {
  try {
    const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
    const userId = auth?.userId || req.query.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const intake = await prisma.aIIntake.findFirst({
      where: { id, userId }
    });

    if (!intake) {
      return res.status(404).json({ error: "Intake record not found" });
    }

    // Format budget as a readable string for frontend state
    const formattedBudget = intake.budgetMin && intake.budgetMax 
      ? `$${intake.budgetMin.toLocaleString()} - $${intake.budgetMax.toLocaleString()}`
      : intake.budgetMin 
      ? `$${intake.budgetMin.toLocaleString()}` 
      : intake.budgetMax 
      ? `$${intake.budgetMax.toLocaleString()}` 
      : '';

    // Wrap confidence schema in metadata object for frontend compatibility
    const responsePayload = {
      ...intake,
      budget: formattedBudget,
      timeline: intake.timeline || '—',
      metadata: {
        confidence: intake.confidence || {}
      }
    };

    res.json(responsePayload);
  } catch (error: any) {
    console.error("❌ Error fetching intake detail:", error.message);
    res.status(500).json({ error: "Failed to fetch intake detail", details: error.message });
  }
});

// --- 4. Process New Raw Intake Message via Gemini ---
router.post('/', async (req: any, res) => {
  try {
    const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
    const userId = auth?.userId || req.body.userId || req.query.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID required" });
    }

    const { rawMessage, clientEmail, clientName } = req.body;
    if (!rawMessage) {
      return res.status(400).json({ error: "rawMessage is required" });
    }

    const prompt = `
      Analyze this incoming client message/lead submission for an agency:
      "${rawMessage}"

      Extract and return ONLY a raw JSON object (no markdown code blocks) with the following exact structure:
      {
        "extractedName": "client's name if mentioned in text, otherwise 'Inbound Lead'",
        "extractedCompany": "company name if mentioned or 'Independent'",
        "extractedEmail": "email if mentioned or null",
        "projectType": "e.g., Web App, Landing Page, Mobile App, E-commerce Marketing Campaign",
        "scopeSummary": "a concise 2-3 sentence summary of what the client wants built or done",
        "estimatedBudget": { "min": number, "max": number, "currency": "USD" },
        "timeline": "extract explicit timeline or target launch date/event (e.g., 'December 1, 2026', 'Next month') or null if missing",
        "leadScore": number between 1 and 100,
        "qualified": boolean,
        "urgency": "low" | "medium" | "high",
        "confidence": {
          "projectType": 0.0 to 1.0,
          "budget": 0.0 to 1.0,
          "timeline": 0.0 to 1.0
        }
      }
    `;

    const aiResult = await model.generateContent(prompt);
    const textResponse = aiResult.response.text();
    const cleanJson = textResponse.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    const finalEmail = clientEmail || parsed.extractedEmail || `lead_${Date.now()}_inquiry@placeholder.com`;
    const finalName = clientName || parsed.extractedName || 'Inbound Lead';
    const finalCompany = parsed.extractedCompany || 'Independent';

    const budgetMin = parsed.estimatedBudget?.min || null;
    const budgetMax = parsed.estimatedBudget?.max || null;

    const newIntake = await prisma.aIIntake.create({
      data: {
        userId,
        contactName: finalName,
        email: finalEmail,
        company: finalCompany,
        projectType: parsed.projectType || 'Web Development',
        requirements: parsed.scopeSummary ? [parsed.scopeSummary] : [],
        timeline: parsed.timeline || null,
        budgetMin: typeof budgetMin === 'number' ? budgetMin : null,
        budgetMax: typeof budgetMax === 'number' ? budgetMax : null,
        score: parsed.leadScore || 50,
        status: 'PENDING_REVIEW',
        confidence: parsed.confidence || {},
        rawMessage
      }
    });

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'AI_INTAKE_RECEIVED',
        description: `New inbound AI intake processed for ${finalName} (${parsed.projectType})`,
        module: 'ai-intake',
        targetId: newIntake.id
      }
    });

    return res.status(201).json(newIntake);
  } catch (error: any) {
    console.error("❌ AI Intake Processing Error:", error.message);
    return res.status(500).json({ error: "Failed to process AI intake", details: error.message });
  }
});

// --- 5. Manual Override / Update Extracted Fields (PATCH) ---
router.patch('/:id', async (req: any, res) => {
  try {
    const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
    const userId = auth?.userId || req.body.userId;
    const { id } = req.params;
    const updates = { ...req.body };

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (updates.budget && typeof updates.budget === 'string') {
      const numbers = updates.budget.replace(/[^0-9]/g, ' ').trim().split(/\s+/).map(Number).filter(n => !isNaN(n));
      if (numbers.length >= 2) {
        updates.budgetMin = numbers[0];
        updates.budgetMax = numbers[1];
      } else if (numbers.length === 1) {
        updates.budgetMin = numbers[0];
      }
      delete updates.budget;
    }

    const updatedIntake = await prisma.aIIntake.updateMany({
      where: { id, userId },
      data: updates
    });

    if (updatedIntake.count === 0) {
      return res.status(404).json({ error: "Intake record not found or unauthorized" });
    }

    const freshRecord = await prisma.aIIntake.findUnique({ where: { id } });
    
    const formattedBudget = freshRecord?.budgetMin && freshRecord?.budgetMax 
      ? `$${freshRecord.budgetMin.toLocaleString()} - $${freshRecord.budgetMax.toLocaleString()}`
      : freshRecord?.budgetMin
      ? `$${freshRecord.budgetMin.toLocaleString()}`
      : '';

    res.json({
      ...freshRecord,
      budget: formattedBudget,
      timeline: freshRecord?.timeline || '—',
      metadata: { confidence: freshRecord?.confidence || {} }
    });
  } catch (error: any) {
    console.error("❌ Error updating intake record:", error.message);
    res.status(500).json({ error: "Failed to update intake", details: error.message });
  }
});

// --- 6. Accept Intake (Converts to CRM Client & Project) ---
router.post('/:id/accept', async (req: any, res) => {
  try {
    const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
    const userId = auth?.userId || req.body.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const intake = await prisma.aIIntake.findFirst({
      where: { id, userId }
    });

    if (!intake) {
      return res.status(404).json({ error: "Intake record not found" });
    }

    const client = await prisma.client.create({
      data: {
        userId,
        name: intake.contactName || 'Inbound Lead',
        email: intake.email,
        company: intake.company || 'Independent',
        status: 'active'
      }
    });

    const budgetValue = intake.budgetMax || intake.budgetMin || 0;
    
    await prisma.project.create({
      data: {
        userId,
        clientId: client.id,
        name: intake.projectType || 'New Project',
        status: 'IN_PROGRESS',
        budget: typeof budgetValue === 'number' ? budgetValue : 0
      }
    });

    await prisma.aIIntake.update({
      where: { id },
      data: { 
        status: 'ACCEPTED',
        clientId: client.id
      }
    });

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'AI_INTAKE_ACCEPTED',
        description: `Converted lead ${intake.contactName} into active client and project.`,
        module: 'ai-intake',
        targetId: intake.id
      }
    });

    return res.json({ client: { id: client.id } });
  } catch (error: any) {
    console.error("❌ Error accepting AI intake:", error.message);
    res.status(500).json({ error: "Failed to accept intake", details: error.message });
  }
});

// --- 6b. Reject Intake Endpoint ---
router.post('/:id/reject', async (req: any, res) => {
  try {
    const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
    const userId = auth?.userId || req.body.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const intake = await prisma.aIIntake.findFirst({ where: { id, userId } });
    if (!intake) {
      return res.status(404).json({ error: "Intake record not found" });
    }

    const updated = await prisma.aIIntake.update({
      where: { id },
      data: { status: 'REJECTED' }
    });

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'AI_INTAKE_REJECTED',
        description: `Marked lead ${intake.contactName} as unqualified/rejected.`,
        module: 'ai-intake',
        targetId: intake.id
      }
    });

    return res.json(updated);
  } catch (error: any) {
    console.error("❌ Error rejecting intake:", error.message);
    res.status(500).json({ error: "Failed to reject intake", details: error.message });
  }
});

// --- 7. Generate Proposal from AI Intake ---
router.post('/:id/proposal', async (req: any, res) => {
  try {
    const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
    const userId = auth?.userId || req.body.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const intake = await prisma.aIIntake.findFirst({
      where: { id, userId }
    });

    if (!intake) {
      return res.status(404).json({ error: "Intake record not found" });
    }

    const proposalAmount = intake.budgetMax || intake.budgetMin || 0;

    const proposal = await prisma.proposal.create({
      data: {
        userId,
        clientId: intake.clientId || null,
        intakeId: intake.id,
        title: `${intake.projectType || 'Project'} Proposal for ${intake.contactName}`,
        amount: proposalAmount,
        status: 'draft',
        scopeOfWork: Array.isArray(intake.requirements) ? intake.requirements.join('\n') : null,
        timeline: intake.timeline || null,
      }
    });

    await prisma.activityLog.create({
      data: {
        userId,
        action: 'PROPOSAL_GENERATED_FROM_INTAKE',
        description: `Generated draft proposal for ${intake.contactName}`,
        module: 'ai-intake',
        targetId: proposal.id
      }
    });

    return res.status(201).json(proposal);
  } catch (error: any) {
    console.error("❌ Error generating proposal from intake:", error.message);
    res.status(500).json({ error: "Failed to generate proposal", details: error.message });
  }
});

export default router;