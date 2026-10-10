import { NextResponse } from "next/server";
import { mkdir } from "fs/promises";
import { createWriteStream } from "fs";
import { Readable } from "stream";
import path from "path";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create unique filename
    const ext = path.extname(file.name);
    const basename = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    const filename = `${Date.now()}-${basename}${ext}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filepath = path.join(uploadDir, filename);

    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    // Stream the file to disk instead of buffering in memory
    const readableStream = Readable.fromWeb(file.stream() as any);
    const writeStream = createWriteStream(filepath);

    await new Promise((resolve, reject) => {
      readableStream.pipe(writeStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

