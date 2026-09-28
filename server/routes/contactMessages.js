const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

/*
  IMPORTANT BEFORE PRODUCTION:

  Add admin-only authentication middleware here.

  Example only:
  const { requireAdmin } = require("../middleware/requireAdmin");
  router.use(requireAdmin);
*/

router.get("/", async (req, res) => {
  try {
    const parsedPage = Number.parseInt(req.query.page, 10);
    const parsedLimit = Number.parseInt(req.query.limit, 10);

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

module.exports = router;