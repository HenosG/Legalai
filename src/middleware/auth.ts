// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { db } from "../lib/db";

export async function requireOnboarding(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Extract userId safely from Clerk's request auth object
  const auth = (req as any).auth;
  const userId = auth?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const workspace = await db.workspace.findUnique({
    where: { userId },
  });

  // If workspace doesn't exist or not onboarded, return error with redirect URL
  if (!workspace || !workspace.isOnboarded) {
    return res.status(403).json({ 
      error: "Onboarding required", 
      redirectUrl: "/onboarding" 
    });
  }

  // Attach userId back to req so downstream controllers can use it easily
  (req as any).userId = userId;

  next();
}