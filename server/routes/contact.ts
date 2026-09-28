import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 320;
const MAX_SUBJECT_LENGTH = 200;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;

const allowedSubjects = new Set([
  "Product question",
  "Pricing and plans",
  "Account support",
  "Security or privacy",
  "Partnership or integration",
  "General question",
]);

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value: unknown) {
  return cleanText(value).toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * POST /api/contact
 *
 * Public endpoint used by src/pages/Contact.tsx.
 *
 * Expected body:
 * {
 *   firstName: string,
 *   lastName: string,
 *   email: string,
 *   subject: string | null,
 *   message: string
 * }
 */
router.post("/", async (req, res) => {
  try {
    const firstName = cleanText(req.body?.firstName);
    const lastName = cleanText(req.body?.lastName);
    const email = normalizeEmail(req.body?.email);
    const subject = cleanText(req.body?.subject) || null;
    const message = cleanText(req.body?.message);

    if (!firstName || firstName.length > MAX_NAME_LENGTH) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid first name.",
      });
    }

    if (!lastName || lastName.length > MAX_NAME_LENGTH) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid last name.",
      });
    }

    if (!email || email.length > MAX_EMAIL_LENGTH || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (subject && !allowedSubjects.has(subject)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid contact topic.",
      });
    }

    if (subject && subject.length > MAX_SUBJECT_LENGTH) {
      return res.status(400).json({
        success: false,
        message: "Your contact topic is too long.",
      });
    }

    if (
      !message ||
      message.length < MIN_MESSAGE_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        message: `Your message must be between ${MIN_MESSAGE_LENGTH} and ${MAX_MESSAGE_LENGTH} characters.`,
      });
    }

    const contactSubmission = await prisma.contactSubmission.create({
      data: {
        firstName,
        lastName,
        email,
        subject,
        message,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message:
        "Your message has been received. The RelunoOS team will review it shortly.",
      data: {
        id: contactSubmission.id,
        createdAt: contactSubmission.createdAt,
      },
    });
  } catch (error) {
    console.error("POST /api/contact failed:", error);

    return res.status(500).json({
      success: false,
      message:
        "We could not receive your message right now. Please try again later.",
    });
  }
});

export default router;