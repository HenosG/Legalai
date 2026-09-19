import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "document";
    const typeId = (formData.get("typeId") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Vercel Blob storage
    const blob = await put(`relunoos/${type}/${file.name}`, file, {
      access: "public",
    });

    // Save document metadata into database
    const documentRecord = await db.document.create({
      data: {
        userId: user.id,
        type: type,
        typeId: typeId,
        fileName: file.name,
        fileUrl: blob.url,
        fileSize: file.size,
        mimeType: file.type,
      },
    });

    return NextResponse.json({ success: true, url: blob.url, document: documentRecord });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}