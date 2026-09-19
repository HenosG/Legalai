"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

export async function getAuthenticatedContext() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign in to continue.");
  }

  const allowed = await checkRateLimit(user.id);
  if (!allowed) {
    throw new Error("Too many requests. Please try again shortly.");
  }

  // Retrieve or default organization scoping for multi-tenancy
  let orgId = user.publicMetadata?.organizationId as string | undefined;
  if (!orgId) {
    orgId = `org_${user.id}`;
  }

  return {
    userId: user.id,
    organizationId: orgId,
    email: user.emailAddresses[0]?.emailAddress,
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
  };
}

export async function logUserAction(userId: string, orgId: string, action: string, description: string, moduleName: string, targetId?: string) {
  try {
    await db.activityLog.create({
      data: {
        userId,
        organizationId: orgId,
        action,
        description,
        module: moduleName,
        targetId: targetId || null,
      },
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}