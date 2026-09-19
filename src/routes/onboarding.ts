// src/routes/onboarding.ts
import { Router, Request, Response } from "express";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { getAuth, clerkClient } from "@clerk/express";

const router = Router();
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ─── Validation Schemas ──────────────────────────────────────────────────────
const businessProfileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessSlug: z.string().min(1, "Business slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  currency: z.string().default("USD"),
  country: z.string().default("US"),
});

const industrySchema = z.object({
  industry: z.string().min(1, "Industry is required"),
  businessType: z.string().min(1, "Business type is required"),
  agentName: z.string().optional().default("Rulo"), // 👈 Allow customizing agent name
});

const questionAnswerSchema = z.object({
  answers: z.record(z.string(), z.string()),
});

// Robust helper to grab Clerk User ID safely
const getUserId = (req: Request): string | null => {
  try {
    const authObject = getAuth(req);
    if (authObject?.userId) return authObject.userId;

    const rawAuth = (req as any).auth;
    if (typeof rawAuth === "function") {
      const evaluated = rawAuth();
      if (evaluated?.userId) return evaluated.userId;
    } else if (rawAuth?.userId) {
      return rawAuth.userId;
    } else if (rawAuth?.sessionClaims?.sub) {
      return rawAuth.sessionClaims.sub;
    }

    return null;
  } catch (err) {
    console.error("Error extracting user ID from request:", err);
    return null;
  }
};

// ─── POST /api/onboarding/step1: Business Profile ─────────────────────────────
router.post("/step1", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const validated = businessProfileSchema.parse(req.body);

    let userEmail = `${userId}@clerk.user`;
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      if (clerkUser?.emailAddresses?.length > 0) {
        userEmail = clerkUser.emailAddresses[0].emailAddress;
      }
    } catch (clerkErr) {
      console.warn("Could not fetch user details from Clerk, using fallback:", clerkErr);
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: { email: userEmail },
      create: { id: userId, email: userEmail },
    });

    const existingWorkspace = await prisma.workspace.findUnique({ where: { userId } });

    if (existingWorkspace) {
      const updated = await prisma.workspace.update({
        where: { userId },
        data: validated,
      });
      return res.json({ workspace: updated });
    }

    const workspace = await prisma.workspace.create({
      data: {
        ...validated,
        userId,
        industry: "unassigned",
        businessType: "unassigned",
      },
    });

    res.json({ workspace });
  } catch (error) {
    console.error("Onboarding step 1 error:", error);
    res.status(400).json({ error: "Invalid input data" });
  }
});

// ─── POST /api/onboarding/step2: Industry + Business Type + Agent Name ────────
router.post("/step2", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const validated = industrySchema.parse(req.body);
    const workspace = await prisma.workspace.update({
      where: { userId },
      data: {
        industry: validated.industry,
        businessType: validated.businessType,
        agentName: validated.agentName || "Rulo",
      },
    });

    res.json({ workspace });
  } catch (error) {
    console.error("Onboarding step 2 error:", error);
    res.status(400).json({ error: "Invalid input data" });
  }
});

// ─── POST /api/onboarding/step3: AI Questionnaire Answers ─────────────────────
router.post("/step3", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { answers } = questionAnswerSchema.parse(req.body);
    const workspace = await prisma.workspace.findUnique({ where: { userId } });

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found. Complete step 1 first." });
    }

    const onboardingResponses = await Promise.all(
      Object.entries(answers).map(([questionKey, answer]) =>
        prisma.onboardingResponse.create({
          data: {
            workspaceId: workspace.id,
            questionKey,
            answer,
          },
        })
      )
    );

    res.json({ success: true, responses: onboardingResponses });
  } catch (error) {
    console.error("Onboarding step 3 error:", error);
    res.status(400).json({ error: "Failed to save questionnaire responses" });
  }
});

// ─── POST /api/onboarding/complete: Finalize & Trigger AI Generation ─────────
router.post("/complete", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const workspace = await prisma.workspace.findUnique({
      where: { userId },
      include: { onboardingData: true },
    });

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const aiConfig = await generateAIConfig(workspace);

    const updatedWorkspace = await prisma.workspace.update({
      where: { userId },
      data: {
        proposalTemplateId: aiConfig.proposalTemplateId,
        crmPipelineId: aiConfig.crmPipelineId,
        invoiceTemplateId: aiConfig.invoiceTemplateId,
        isOnboarded: true,
        onboardedAt: new Date(),
      },
    });

    res.json({ workspace: updatedWorkspace, aiConfig });
  } catch (error) {
    console.error("Onboarding complete error:", error);
    res.status(500).json({ error: "Failed to complete onboarding & generate AI assets" });
  }
});

// ─── GET /api/onboarding/status: Check Status ────────────────────────────────
router.get("/status", async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const workspace = await prisma.workspace.findUnique({
      where: { userId },
      select: {
        isOnboarded: true,
        businessName: true,
        industry: true,
        businessSlug: true,
        agentName: true,
      },
    });

    if (!workspace) {
      return res.json({ isOnboarded: false, workspace: null });
    }

    res.json({ isOnboarded: workspace.isOnboarded, workspace });
  } catch (error) {
    console.error("Check status error:", error);
    res.status(500).json({ error: "Failed to check status" });
  }
});

// ─── Gemini AI Generation Helper Function ────────────────────────────────────
async function generateAIConfig(workspace: any) {
  const { industry, businessType, agentName, onboardingData } = workspace;
  const context = onboardingData.map((r: any) => `${r.questionKey}: ${r.answer}`).join("\n");
  const agent = agentName || "Rulo";

  // 1. Generate Proposal Template
  const proposalPrompt = `You are ${agent}, an elite AI business operating system. You are configuring a high-converting proposal template for a ${industry} business specializing in ${businessType}. Context:\n${context}\nReturn raw JSON with fields: sections, lineItems, pricingModel`;
  const proposalResult = await model.generateContent(proposalPrompt);
  const proposalText = proposalResult.response.text() || "{}";
  const proposalTemplate = JSON.parse(proposalText.match(/\{[\s\S]*\}/)![0]);

  const proposalTemplateRecord = await prisma.proposalTemplate.create({
    data: { workspaceId: workspace.id, name: `${industry} Standard Proposal`, content: proposalTemplate },
  });

  // 2. Generate CRM Pipeline Stages
  const pipelinePrompt = `You are ${agent}. Configure an optimized sales CRM pipeline for a ${industry} (${businessType}) business. Context:\n${context}\nReturn raw JSON object with field 'stages' containing an array of strings: e.g. {"stages": ["NEW", "QUALIFIED", "PROPOSAL_SENT", "CLOSED_WON"]}`;
  const pipelineResult = await model.generateContent(pipelinePrompt);
  const pipelineText = pipelineResult.response.text() || "{}";
  const pipelineStages = JSON.parse(pipelineText.match(/\{[\s\S]*\}/)![0]);

  const pipelineRecord = await prisma.crmPipeline.create({
    data: { workspaceId: workspace.id, name: `${industry} Sales Pipeline`, stages: pipelineStages.stages || ["NEW", "QUALIFIED", "PROPOSAL_SENT", "CLOSED_WON"] },
  });

  // 3. Generate Invoice Template
  const invoicePrompt = `You are ${agent}. Configure a professional invoice template for a ${industry} (${businessType}) business. Context:\n${context}\nReturn raw JSON with fields: fields, lineItems, paymentTerms`;
  const invoiceResult = await model.generateContent(invoicePrompt);
  const invoiceText = invoiceResult.response.text() || "{}";
  const invoiceTemplate = JSON.parse(invoiceText.match(/\{[\s\S]*\}/)![0]);

  const invoiceTemplateRecord = await prisma.invoiceTemplate.create({
    data: { workspaceId: workspace.id, name: `${industry} Standard Invoice`, content: invoiceTemplate },
  });

  return {
    proposalTemplateId: proposalTemplateRecord.id,
    crmPipelineId: pipelineRecord.id,
    invoiceTemplateId: invoiceTemplateRecord.id,
  };
}

export default router;