import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireContactAdmin } from "../middleware/requireContactAdmin.js";

const router = Router();
const prisma = new PrismaClient();

/*
  Every endpoint in this router requires:
  1. A signed-in Clerk user.
  2. That user's Clerk ID to appear in CONTACT_ADMIN_CLERK_USER_IDS.
*/
router.use(requireContactAdmin);

/**
 * GET /api/contact-messages?page=1&limit=25
 *
 * Returns newest messages first.
 * Private: contact admins only.
 */
router.get("/", async (req, res) => {
  try {
    const parsedPage = Number.parseInt(String(req.query.page || "1"), 10);
    const parsedLimit = Number.parseInt(String(req.query.limit || "25"), 10);

    const page =
      Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const limit =
      Number.isInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 100)
        : 25;

    const skip = (page - 1) * limit;

    const [messages, total] = await prisma.$transaction([
      prisma.contactSubmission.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          subject: true,
          message: true,
          isRead: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.contactSubmission.count(),
    ]);

    return res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error("GET /api/contact-messages failed:", error);

    return res.status(500).json({
      success: false,
      message: "We could not retrieve contact messages right now.",
    });
  }
});

/**
 * PATCH /api/contact-messages/:id/read
 *
 * Marks one contact message as read or unread.
 * Private: contact admins only.
 *
 * Expected body:
 * {
 *   isRead: boolean
 * }
 */
router.patch("/:id/read", async (req, res) => {
  try {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const isRead = req.body?.isRead;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "A contact message ID is required.",
      });
    }

    if (typeof isRead !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isRead must be a boolean value.",
      });
    }

    const updatedMessage = await prisma.contactSubmission.update({
      where: { id },
      data: { isRead },
      select: {
        id: true,
        isRead: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedMessage,
    });
  } catch (error: any) {
    console.error("PATCH /api/contact-messages/:id/read failed:", error);

    if (error?.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "We could not update the contact message right now.",
    });
  }
});

export default router;