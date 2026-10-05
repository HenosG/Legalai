import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

const geminiApiKey =
  process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";

const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const model = genAI
  ? genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    })
  : null;

const LIVE_ACTIVITY_WINDOW_MS = 48 * 60 * 60 * 1000;
const LIVE_ACTIVITY_LIMIT = 25;

function getAuth(req) {
  return req.auth && typeof req.auth === "function" ? req.auth() : req.auth;
}

function getAuthUserId(req) {
  return getAuth(req)?.userId || null;
}

function clampScore(value, minimum = 0, maximum = 100) {
  const score = Number(value);

  if (!Number.isFinite(score)) {
    return minimum;
  }

  return Math.max(minimum, Math.min(maximum, Math.round(score)));
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function safeArray(value) {
  return Array.isArray(value)
    ? value.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
}

function safeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function toNullableNumber(value) {
  const numericValue = Number(value);

  return Number.isFinite(numericValue) && numericValue >= 0
    ? numericValue
    : null;
}

function normalizeUrgency(value) {
  const normalized = normalizeText(value);

  if (normalized === "high" || normalized === "urgent") return "high";
  if (normalized === "medium" || normalized === "moderate") return "medium";
  if (normalized === "low") return "low";

  return "unknown";
}

function parseGeminiJson(text) {
  const cleanText = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleanText.indexOf("{");
  const lastBrace = cleanText.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Gemini did not return valid JSON.");
  }

  return JSON.parse(cleanText.slice(firstBrace, lastBrace + 1));
}

function getActivityDescription(activity) {
  if (activity.description) return activity.description;

  return activity.action || "Workspace activity";
}

function mapIntake(intake) {
  const scoreBreakdown = safeObject(intake.scoreBreakdown);
  const confidence = safeObject(intake.confidence);

  const budget = {
    min: intake.budgetMin ?? undefined,
    max: intake.budgetMax ?? undefined,
  };

  const hasBudget = budget.min !== undefined || budget.max !== undefined;

  return {
    id: intake.id,
    clientId: intake.clientId || null,
    channel: confidence.channel || "manual",
    rawMessage: intake.rawMessage,
    projectType: intake.projectType || "Unspecified project",
    budget: hasBudget ? budget : null,
    timeline: {
      deadline: intake.timeline || undefined,
      urgency: confidence.urgency || "unknown",
    },
    requirements: Array.isArray(intake.requirements)
      ? intake.requirements
      : [],
    leadScore: intake.score || 0,
    qualified: Boolean(scoreBreakdown.qualified),
    status: intake.status,
    createdAt: intake.createdAt,
    updatedAt: intake.updatedAt,

    // Extra fields for richer UI later without needing another API revision.
    serviceFit:
      typeof scoreBreakdown.serviceFit === "boolean"
        ? scoreBreakdown.serviceFit
        : null,
    matchedServices: safeArray(scoreBreakdown.matchedServices),
    fitReason:
      typeof scoreBreakdown.fitReason === "string"
        ? scoreBreakdown.fitReason
        : null,
    followUpQuestions: safeArray(scoreBreakdown.followUpQuestions),
    confidenceLevel:
      typeof confidence.level === "string" ? confidence.level : "unknown",
  };
}

async function getUserWorkspaceContext(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      organizationId: true,
      clerkOrgId: true,
      workspace: {
        select: {
          id: true,
          businessName: true,
          businessSlug: true,
          industry: true,
          businessType: true,
          agentName: true,
          onboardingData: {
            select: {
              questionKey: true,
              answer: true,
              metadata: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error(
      "Your user record was not found. Complete onboarding before creating AI intakes."
    );
  }

  const workspace = user.workspace || null;
  const onboardingResponses = workspace?.onboardingData || [];

  const responses = onboardingResponses.map((item) => ({
    questionKey: item.questionKey,
    answer: item.answer,
    metadata: item.metadata,
  }));

  return {
    user,
    workspace,
    onboardingResponses: responses,
  };
}

function extractServiceContext(workspace, onboardingResponses) {
  const serviceAnswerKeys = [
    "services",
    "service",
    "offerings",
    "capabilities",
    "skills",
    "specialties",
    "specialty",
    "what_you_do",
    "what-do-you-do",
    "primary_services",
    "primary-services",
    "business_services",
    "business-services",
  ];

  const idealClientKeys = [
    "ideal_client",
    "ideal-client",
    "target_client",
    "target-client",
    "target_audience",
    "target-audience",
    "audience",
    "customer",
    "customers",
  ];

  const positioningKeys = [
    "positioning",
    "description",
    "business_description",
    "business-description",
    "about",
    "value_proposition",
    "value-proposition",
  ];

  const services = [];
  const idealClientAnswers = [];
  const positioningAnswers = [];

  for (const response of onboardingResponses) {
    const key = normalizeText(response.questionKey)
      .replace(/\s+/g, "_")
      .replace(/-/g, "_");

    const answer = String(response.answer || "").trim();
    const metadata = safeObject(response.metadata);

    const metadataValues = [
      ...safeArray(metadata.services),
      ...safeArray(metadata.offerings),
      ...safeArray(metadata.capabilities),
      ...safeArray(metadata.skills),
      ...safeArray(metadata.selectedServices),
      ...safeArray(metadata.selected_services),
    ];

    const isServiceAnswer = serviceAnswerKeys.some((serviceKey) =>
      key.includes(serviceKey.replace(/-/g, "_"))
    );

    const isIdealClientAnswer = idealClientKeys.some((idealClientKey) =>
      key.includes(idealClientKey.replace(/-/g, "_"))
    );

    const isPositioningAnswer = positioningKeys.some((positioningKey) =>
      key.includes(positioningKey.replace(/-/g, "_"))
    );

    if (isServiceAnswer) {
      if (answer) {
        services.push(
          ...answer
            .split(/[,;\n|]/)
            .map((item) => item.trim())
            .filter(Boolean)
        );
      }

      services.push(...metadataValues);
    }

    if (isIdealClientAnswer && answer) {
      idealClientAnswers.push(answer);
    }

    if (isPositioningAnswer && answer) {
      positioningAnswers.push(answer);
    }
  }

  const fallbackServices = [
    workspace?.businessType,
    workspace?.industry,
  ].filter(Boolean);

  return {
    workspaceName: workspace?.businessName || "Your workspace",
    businessType: workspace?.businessType || "",
    industry: workspace?.industry || "",
    agentName: workspace?.agentName || "Reluno",
    services: uniqueStrings([...services, ...fallbackServices]),
    idealClient: uniqueStrings(idealClientAnswers).join(" | "),
    positioning: uniqueStrings(positioningAnswers).join(" | "),
  };
}

function getServiceCategories(services) {
  const normalizedServices = services.map(normalizeText).filter(Boolean);

  const categories = new Set();

  const categoryDefinitions = {
    web: [
      "website",
      "web design",
      "webflow",
      "wordpress",
      "landing page",
      "ecommerce",
      "e-commerce",
      "shopify",
      "frontend",
      "front-end",
    ],
    uiux: [
      "ui",
      "ux",
      "ui ux",
      "ui/ux",
      "product design",
      "interface design",
      "app design",
      "user experience",
      "user interface",
    ],
    branding: [
      "branding",
      "brand identity",
      "logo",
      "visual identity",
      "brand strategy",
      "creative direction",
    ],
    development: [
      "development",
      "web development",
      "software",
      "mobile app",
      "app development",
      "saas",
      "api",
    ],
    marketing: [
      "marketing",
      "seo",
      "content strategy",
      "growth",
      "campaign",
      "social media",
      "advertising",
    ],
    consulting: [
      "consulting",
      "strategy",
      "research",
      "audit",
      "discovery",
      "workshop",
    ],
    floral: [
      "floral",
      "florist",
      "flowers",
      "event flowers",
      "wedding flowers",
    ],
    photography: [
      "photography",
      "photographer",
      "photo shoot",
      "photoshoot",
      "videography",
      "video production",
    ],
    landscaping: [
      "landscaping",
      "landscape",
      "lawn care",
      "gardening",
      "garden design",
    ],
  };

  for (const service of normalizedServices) {
    for (const [category, keywords] of Object.entries(categoryDefinitions)) {
      if (keywords.some((keyword) => service.includes(keyword))) {
        categories.add(category);
      }
    }
  }

  return [...categories];
}

function getMessageCategories(message) {
  const normalizedMessage = normalizeText(message);

  const categories = new Set();

  const categoryDefinitions = {
    web: [
      "website",
      "web design",
      "webflow",
      "wordpress",
      "landing page",
      "ecommerce",
      "e-commerce",
      "shopify",
      "redesign",
    ],
    uiux: [
      "ui",
      "ux",
      "ui ux",
      "ui/ux",
      "product design",
      "interface",
      "app design",
      "user experience",
      "user interface",
    ],
    branding: [
      "branding",
      "brand identity",
      "logo",
      "visual identity",
      "brand strategy",
      "creative direction",
    ],
    development: [
      "development",
      "web development",
      "software",
      "mobile app",
      "app development",
      "saas",
      "api",
    ],
    marketing: [
      "marketing",
      "seo",
      "content strategy",
      "growth",
      "campaign",
      "social media",
      "advertising",
    ],
    consulting: [
      "consulting",
      "strategy",
      "research",
      "audit",
      "discovery",
      "workshop",
    ],
    floral: [
      "floral",
      "florist",
      "flowers",
      "wedding flowers",
      "bouquet",
    ],
    photography: [
      "photography",
      "photographer",
      "photo shoot",
      "photoshoot",
      "videography",
      "video production",
    ],
    landscaping: [
      "landscaping",
      "landscape",
      "lawn",
      "gardening",
      "garden design",
    ],
  };

  for (const [category, keywords] of Object.entries(categoryDefinitions)) {
    if (keywords.some((keyword) => normalizedMessage.includes(keyword))) {
      categories.add(category);
    }
  }

  return [...categories];
}

function detectServiceFit(rawMessage, services) {
  const normalizedMessage = normalizeText(rawMessage);
  const normalizedServices = services.map(normalizeText).filter(Boolean);

  const directMatches = normalizedServices.filter((service) => {
    if (service.length < 3) return false;

    return normalizedMessage.includes(service);
  });

  const workspaceCategories = getServiceCategories(normalizedServices);
  const messageCategories = getMessageCategories(normalizedMessage);

  const categoryMatches = workspaceCategories.filter((category) =>
    messageCategories.includes(category)
  );

  const matchedServices = uniqueStrings([
    ...directMatches,
    ...categoryMatches,
  ]);

  const hasServiceContext = normalizedServices.length > 0;
  const matched = matchedServices.length > 0;

  return {
    hasServiceContext,
    matched,
    matchedServices,
    workspaceCategories,
    messageCategories,
  };
}

function hasClearProjectScope(rawMessage, requirements, projectType) {
  const normalizedMessage = normalizeText(rawMessage);

  const scopeTerms = [
    "need",
    "want",
    "build",
    "redesign",
    "create",
    "develop",
    "design",
    "help with",
    "looking for",
    "project",
    "website",
    "app",
    "brand",
    "logo",
    "strategy",
  ];

  return Boolean(
    String(projectType || "").trim() ||
      safeArray(requirements).length > 0 ||
      scopeTerms.some((term) => normalizedMessage.includes(term))
  );
}

function applyLeadScoreGuardrails({
  aiScore,
  serviceFit,
  hasServiceContext,
  hasClearScope,
  hasBudgetOrTimeline,
}) {
  let score = clampScore(aiScore);

  // Workspace services exist and the request does not match them.
  // It can never become a high-value lead merely because Gemini guessed so.
  if (hasServiceContext && !serviceFit) {
    return Math.min(score, 15);
  }

  // The workspace has no saved service context yet.
  // Keep it conservative until onboarding data exists.
  if (!hasServiceContext) {
    return Math.min(score, 35);
  }

  // Relevant but vague: do not present it as highly qualified.
  if (!hasClearScope) {
    return Math.min(score, 45);
  }

  // Relevant, specific, and commercial context is present.
  if (serviceFit && hasClearScope && hasBudgetOrTimeline) {
    return Math.max(score, 60);
  }

  return score;
}

function buildDefaultFollowUpQuestions({
  serviceFit,
  hasServiceContext,
  hasClearScope,
  hasBudgetOrTimeline,
  workspaceServices,
}) {
  if (hasServiceContext && !serviceFit) {
    const serviceList = workspaceServices.slice(0, 4).join(", ");

    return [
      `Are you looking for support related to ${serviceList || "our listed services"}?`,
      "Could you share the digital, brand, product, or business outcome you are trying to achieve?",
    ];
  }

  const questions = [];

  if (!hasClearScope) {
    questions.push(
      "What specific outcome or deliverable are you looking for?"
    );
  }

  if (!hasBudgetOrTimeline) {
    questions.push(
      "Do you have a target budget range or preferred timeline?"
    );
  }

  if (!questions.length) {
    questions.push(
      "What does success look like for this project?"
    );
  }

  return questions;
}

async function createActivity({
  userId,
  organizationId,
  action,
  description,
  module = "AI_INTAKE",
  targetId,
}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        organizationId: organizationId || null,
        action,
        description,
        module,
        targetId: targetId || null,
      },
    });
  } catch (error) {
    console.error("Failed to create activity log:", error);
  }
}

async function analyzeWithGemini({
  rawMessage,
  workspaceContext,
  deterministicFit,
}) {
  const fallback = {
    contactName: "Unknown contact",
    company: null,
    email: null,
    projectType: "Unspecified project",
    budget: {
      min: null,
      max: null,
    },
    timeline: {
      deadline: null,
      urgency: "unknown",
    },
    requirements: [],
    leadScore: deterministicFit.matched ? 35 : 5,
    qualified: false,
    confidenceLevel: "low",
    fitReason: deterministicFit.matched
      ? "The inquiry appears related to the workspace services, but more qualification is needed."
      : deterministicFit.hasServiceContext
      ? "The inquiry does not clearly match the workspace's listed services."
      : "The workspace does not yet have enough saved service context for a confident fit assessment.",
    followUpQuestions: buildDefaultFollowUpQuestions({
      serviceFit: deterministicFit.matched,
      hasServiceContext: deterministicFit.hasServiceContext,
      hasClearScope: false,
      hasBudgetOrTimeline: false,
      workspaceServices: workspaceContext.services,
    }),
  };

  if (!model) {
    return fallback;
  }

  const prompt = `
You qualify incoming sales inquiries for a specific service business.

WORKSPACE CONTEXT:
${JSON.stringify(workspaceContext, null, 2)}

DETERMINISTIC SERVICE-FIT SIGNAL:
${JSON.stringify(
  {
    workspaceHasSavedServices: deterministicFit.hasServiceContext,
    likelyServiceMatch: deterministicFit.matched,
    matchedServices: deterministicFit.matchedServices,
    workspaceCategories: deterministicFit.workspaceCategories,
    inquiryCategories: deterministicFit.messageCategories,
  },
  null,
  2
)}

INCOMING INQUIRY:
${rawMessage}

STRICT RULES:
1. Judge fit against the actual listed workspace services, not against generic words such as "design."
2. If the inquiry is unrelated to the listed services, set serviceFit to false and leadScore from 0 to 15.
3. If the inquiry is vague or lacks a clear deliverable, leadScore must not exceed 45.
4. Only score 60 or higher if the inquiry matches a workspace service, has a clear scope, and includes budget or timeline context.
5. Never invent a budget, deadline, company, email, requirements, or capabilities.
6. Write 1–3 concise follow-up questions when information is missing.
7. Return JSON only. No markdown and no explanation outside JSON.

Return exactly this JSON object:
{
  "contactName": "string or null",
  "company": "string or null",
  "email": "string or null",
  "projectType": "string or null",
  "serviceFit": true,
  "matchedServices": ["string"],
  "leadScore": 0,
  "qualified": false,
  "confidenceLevel": "low | medium | high",
  "fitReason": "string",
  "requirements": ["string"],
  "budget": {
    "min": null,
    "max": null
  },
  "timeline": {
    "deadline": "string or null",
    "urgency": "low | medium | high | unknown"
  },
  "followUpQuestions": ["string"]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const parsed = parseGeminiJson(result.response.text());

    return {
      ...fallback,
      ...parsed,
      requirements: safeArray(parsed.requirements),
      matchedServices: safeArray(parsed.matchedServices),
      followUpQuestions: safeArray(parsed.followUpQuestions),
      budget: {
        min: toNullableNumber(parsed?.budget?.min),
        max: toNullableNumber(parsed?.budget?.max),
      },
      timeline: {
        deadline:
          typeof parsed?.timeline?.deadline === "string"
            ? parsed.timeline.deadline
            : null,
        urgency: normalizeUrgency(parsed?.timeline?.urgency),
      },
    };
  } catch (error) {
    console.error("Gemini intake analysis failed; using safe fallback:", error);

    return fallback;
  }
}

// ─── GET /api/ai-intake ──────────────────────────────────────────────────────

router.get("/", async (req, res) => {
  try {
    const userId = getAuthUserId(req);

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const intakes = await prisma.aiIntake.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return res.status(200).json({
      intakes: intakes.map(mapIntake),
    });
  } catch (error) {
    console.error("Failed to fetch AI intakes:", error);

    return res.status(500).json({
      error: "Failed to fetch AI intakes.",
    });
  }
});

// ─── POST /api/ai-intake ─────────────────────────────────────────────────────

router.post("/", async (req, res) => {
  try {
    const userId = getAuthUserId(req);

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const rawMessage = String(req.body?.rawMessage || "").trim();
    const channel = String(req.body?.channel || "manual").trim() || "manual";

    if (!rawMessage) {
      return res.status(400).json({
        error: "An inquiry message is required.",
      });
    }

    if (rawMessage.length > 10000) {
      return res.status(400).json({
        error: "Inquiry message must be 10,000 characters or fewer.",
      });
    }

    const { user, workspace, onboardingResponses } =
      await getUserWorkspaceContext(userId);

    const workspaceContext = extractServiceContext(
      workspace,
      onboardingResponses
    );

    const deterministicFit = detectServiceFit(
      rawMessage,
      workspaceContext.services
    );

    const aiResult = await analyzeWithGemini({
      rawMessage,
      workspaceContext,
      deterministicFit,
    });

    const hasClearScope = hasClearProjectScope(
      rawMessage,
      aiResult.requirements,
      aiResult.projectType
    );

    const hasBudgetOrTimeline = Boolean(
      aiResult.budget?.min ||
        aiResult.budget?.max ||
        aiResult.timeline?.deadline ||
        (aiResult.timeline?.urgency &&
          aiResult.timeline.urgency !== "unknown")
    );

    const serviceFit = deterministicFit.hasServiceContext
      ? deterministicFit.matched
      : Boolean(aiResult.serviceFit);

    const finalScore = applyLeadScoreGuardrails({
      aiScore: aiResult.leadScore,
      serviceFit,
      hasServiceContext: deterministicFit.hasServiceContext,
      hasClearScope,
      hasBudgetOrTimeline,
    });

    const qualified =
      serviceFit &&
      hasClearScope &&
      finalScore >= 60 &&
      hasBudgetOrTimeline;

    const fallbackFollowUps = buildDefaultFollowUpQuestions({
      serviceFit,
      hasServiceContext: deterministicFit.hasServiceContext,
      hasClearScope,
      hasBudgetOrTimeline,
      workspaceServices: workspaceContext.services,
    });

    const followUpQuestions =
      aiResult.followUpQuestions.length > 0
        ? aiResult.followUpQuestions.slice(0, 3)
        : fallbackFollowUps;

    const fitReason =
      typeof aiResult.fitReason === "string" && aiResult.fitReason.trim()
        ? aiResult.fitReason.trim()
        : serviceFit
        ? "The inquiry appears relevant to the workspace's listed services."
        : "The inquiry does not match the workspace's listed services.";

    const status = qualified ? "QUALIFIED" : "PENDING_REVIEW";

    const createdIntake = await prisma.aiIntake.create({
      data: {
        userId,
        organizationId: user.organizationId || null,
        rawMessage,
        contactName:
          typeof aiResult.contactName === "string" &&
          aiResult.contactName.trim()
            ? aiResult.contactName.trim()
            : "Unknown contact",
        company:
          typeof aiResult.company === "string" && aiResult.company.trim()
            ? aiResult.company.trim()
            : null,
        email:
          typeof aiResult.email === "string" && aiResult.email.trim()
            ? aiResult.email.trim()
            : null,
        projectType:
          typeof aiResult.projectType === "string" &&
          aiResult.projectType.trim()
            ? aiResult.projectType.trim()
            : "Unspecified project",
        budgetMin: aiResult.budget?.min ?? null,
        budgetMax: aiResult.budget?.max ?? null,
        timeline: aiResult.timeline?.deadline || null,
        requirements: aiResult.requirements.slice(0, 20),
        score: finalScore,
        status,
        scoreBreakdown: {
          serviceFit,
          matchedServices: deterministicFit.matchedServices,
          workspaceServices: workspaceContext.services,
          fitReason,
          qualified,
          hasClearScope,
          hasBudgetOrTimeline,
          followUpQuestions,
          aiScore: clampScore(aiResult.leadScore),
          finalScore,
        },
        confidence: {
          level: aiResult.confidenceLevel || "low",
          channel,
          urgency: aiResult.timeline?.urgency || "unknown",
          serviceContextAvailable: deterministicFit.hasServiceContext,
          guardrailApplied:
            deterministicFit.hasServiceContext && !serviceFit
              ? "unrelated_service_cap"
              : !hasClearScope
              ? "vague_inquiry_cap"
              : null,
        },
      },
    });

    await createActivity({
      userId,
      organizationId: user.organizationId,
      action: "AI intake created",
      description: `New AI intake: ${
        createdIntake.projectType || "Unspecified project"
      } (${finalScore}/100 fit score).`,
      targetId: createdIntake.id,
    });

    return res.status(201).json({
      intake: mapIntake(createdIntake),
    });
  } catch (error) {
    console.error("Failed to create AI intake:", error);

    return res.status(500).json({
      error: "Failed to create AI intake.",
    });
  }
});

// ─── GET /api/ai-intake/activity ─────────────────────────────────────────────

router.get("/activity", async (req, res) => {
  try {
    const userId = getAuthUserId(req);

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), LIVE_ACTIVITY_LIMIT)
      : LIVE_ACTIVITY_LIMIT;

    const since = new Date(Date.now() - LIVE_ACTIVITY_WINDOW_MS);

    const activities = await prisma.activityLog.findMany({
      where: {
        userId,
        createdAt: {
          gte: since,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      select: {
        id: true,
        action: true,
        description: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      activities: activities.map((activity) => ({
        id: activity.id,
        description: getActivityDescription(activity),
        createdAt: activity.createdAt,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch AI intake activity:", error);

    return res.status(500).json({
      error: "Failed to fetch AI intake activity.",
    });
  }
});

// ─── POST /api/ai-intake/:id/accept ──────────────────────────────────────────

router.post("/:id/accept", async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const intakeId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const intake = await prisma.aiIntake.findFirst({
      where: {
        id: intakeId,
        userId,
      },
    });

    if (!intake) {
      return res.status(404).json({
        error: "AI intake not found.",
      });
    }

    const client = await prisma.$transaction(async (tx) => {
      let createdClient;

      if (intake.clientId) {
        createdClient = await tx.client.findFirst({
          where: {
            id: intake.clientId,
            userId,
          },
        });
      }

      if (!createdClient) {
        createdClient = await tx.client.create({
          data: {
            userId,
            organizationId: intake.organizationId || null,
            name: intake.contactName || "Unknown contact",
            email: intake.email || null,
            company: intake.company || null,
            status: "lead",
            tags: ["AI Intake"],
            notes: intake.rawMessage,
          },
        });
      }

      await tx.aiIntake.update({
        where: {
          id: intake.id,
        },
        data: {
          clientId: createdClient.id,
          status: "ACCEPTED",
        },
      });

      return createdClient;
    });

    await createActivity({
      userId,
      organizationId: intake.organizationId,
      action: "AI intake accepted",
      description: `Accepted AI intake and created or linked client ${client.name}.`,
      targetId: intake.id,
    });

    return res.status(200).json({
      client: {
        id: client.id,
        name: client.name,
      },
    });
  } catch (error) {
    console.error("Failed to accept AI intake:", error);

    return res.status(500).json({
      error: "Failed to accept AI intake.",
    });
  }
});

// ─── POST /api/ai-intake/:id/reject ──────────────────────────────────────────

router.post("/:id/reject", async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const intakeId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const intake = await prisma.aiIntake.findFirst({
      where: {
        id: intakeId,
        userId,
      },
      select: {
        id: true,
        organizationId: true,
        projectType: true,
      },
    });

    if (!intake) {
      return res.status(404).json({
        error: "AI intake not found.",
      });
    }

    await prisma.aiIntake.update({
      where: {
        id: intake.id,
      },
      data: {
        status: "REJECTED",
      },
    });

    await createActivity({
      userId,
      organizationId: intake.organizationId,
      action: "AI intake rejected",
      description: `Rejected AI intake: ${
        intake.projectType || "Unspecified project"
      }.`,
      targetId: intake.id,
    });

    return res.status(200).json({
      success: true,
      id: intake.id,
    });
  } catch (error) {
    console.error("Failed to reject AI intake:", error);

    return res.status(500).json({
      error: "Failed to reject AI intake.",
    });
  }
});

// ─── POST /api/ai-intake/:id/proposal ────────────────────────────────────────

router.post("/:id/proposal", async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const intakeId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const intake = await prisma.aiIntake.findFirst({
      where: {
        id: intakeId,
        userId,
      },
      include: {
        proposals: {
          select: {
            id: true,
          },
          take: 1,
        },
      },
    });

    if (!intake) {
      return res.status(404).json({
        error: "AI intake not found.",
      });
    }

    if (intake.proposals.length > 0) {
      return res.status(200).json({
        proposal: {
          id: intake.proposals[0].id,
        },
      });
    }

    let clientId = intake.clientId;

    if (!clientId) {
      const client = await prisma.client.create({
        data: {
          userId,
          organizationId: intake.organizationId || null,
          name: intake.contactName || "Unknown contact",
          email: intake.email || null,
          company: intake.company || null,
          status: "lead",
          tags: ["AI Intake"],
          notes: intake.rawMessage,
        },
      });

      clientId = client.id;

      await prisma.aiIntake.update({
        where: {
          id: intake.id,
        },
        data: {
          clientId,
        },
      });
    }

    const budgetAmount =
      intake.budgetMax || intake.budgetMin || 0;

    const proposal = await prisma.proposal.create({
      data: {
        userId,
        organizationId: intake.organizationId || null,
        clientId,
        intakeId: intake.id,
        title:
          intake.projectType && intake.projectType !== "Unspecified project"
            ? `${intake.projectType} Proposal`
            : "New Project Proposal",
        amount: budgetAmount,
        status: "draft",
        scopeOfWork: intake.requirements,
        timeline: intake.timeline
          ? [intake.timeline]
          : [],
      },
    });

    await prisma.aiIntake.update({
      where: {
        id: intake.id,
      },
      data: {
        status: "PROPOSAL_CREATED",
      },
    });

    await createActivity({
      userId,
      organizationId: intake.organizationId,
      action: "Proposal created from AI intake",
      description: `Created proposal "${proposal.title}" from an AI intake.`,
      targetId: proposal.id,
    });

    return res.status(201).json({
      proposal: {
        id: proposal.id,
      },
    });
  } catch (error) {
    console.error("Failed to create proposal from AI intake:", error);

    return res.status(500).json({
      error: "Failed to create proposal from AI intake.",
    });
  }
});

// ─── DELETE /api/ai-intake/:id ───────────────────────────────────────────────

router.delete("/:id", async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const intakeId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (!intakeId) {
      return res.status(400).json({
        error: "Intake ID is required.",
      });
    }

    const intake = await prisma.aiIntake.findFirst({
      where: {
        id: intakeId,
        userId,
      },
      select: {
        id: true,
        organizationId: true,
        rawMessage: true,
        projectType: true,
      },
    });

    if (!intake) {
      return res.status(404).json({
        error: "AI intake not found.",
      });
    }

    await prisma.aiIntake.delete({
      where: {
        id: intake.id,
      },
    });

    await createActivity({
      userId,
      organizationId: intake.organizationId,
      action: "AI intake deleted",
      description: `Deleted AI intake: ${
        intake.projectType ||
        intake.rawMessage?.slice(0, 80) ||
        "Unspecified project"
      }.`,
      targetId: intake.id,
    });

    return res.status(200).json({
      success: true,
      id: intakeId,
    });
  } catch (error) {
    console.error("Failed to delete AI intake:", error);

    return res.status(500).json({
      error: "Failed to delete AI intake.",
    });
  }
});

export default router;