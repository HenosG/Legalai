"use server";

import { db } from "@/lib/db";
import { createClientSchema } from "@/lib/validations";
import { getAuthenticatedContext, logUserAction } from "@/actions/utils";
import { revalidatePath } from "next/cache";

export async function createClientAction(formData: FormData) {
  try {
    const ctx = await getAuthenticatedContext();

    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      status: formData.get("status") || "ACTIVE",
    };

    const validated = createClientSchema.parse(rawData);

    const client = await db.client.create({
      data: {
        ...validated,
        userId: ctx.userId,
        organizationId: ctx.organizationId,
      },
    });

    await logUserAction(
      ctx.userId,
      ctx.organizationId,
      "CLIENT_CREATED",
      `Created client: ${client.name}`,
      "crm",
      client.id
    );

    revalidatePath("/clients");
    return { success: true, client };
  } catch (error: any) {
    console.error("Client creation error:", error);
    return { success: false, error: error.message || "Failed to create client" };
  }
}