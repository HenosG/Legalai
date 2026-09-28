import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";

function getContactAdminIds() {
  return new Set(
    (process.env.CONTACT_ADMIN_CLERK_USER_IDS || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
  );
}

export function requireContactAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
    }

    const contactAdminIds = getContactAdminIds();

    if (contactAdminIds.size === 0) {
      console.error(
        "CONTACT_ADMIN_CLERK_USER_IDS is not configured. Blocking contact inbox access."
      );

      return res.status(503).json({
        success: false,
        message: "Contact inbox access is not configured.",
      });
    }

    if (!contactAdminIds.has(userId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access contact messages.",
      });
    }

    return next();
  } catch (error) {
    console.error("Contact inbox authorization error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify contact inbox access.",
    });
  }
}