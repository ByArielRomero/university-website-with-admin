import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_SIZE = 500 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
  "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo",
  "application/pdf",
]);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const formData = await req.formData();
    const entry = formData.get("file");
    if (!(entry instanceof File) || entry.size === 0) {
      return NextResponse.json({ error: "Seleccioná un archivo válido" }, { status: 400 });
    }
    if (entry.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ error: "El archivo supera el límite de 500 MB" }, { status: 413 });
    }
    if (!ALLOWED_TYPES.has(entry.type)) {
      return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 415 });
    }

    const extension = path.extname(entry.name).toLowerCase();
    const safeBaseName = path.basename(entry.name, extension)
      .normalize("NFKD").replace(/[\\u0300-\\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").slice(0, 80) || "archivo";
    const filename = `${Date.now()}-${randomUUID()}-${safeBaseName}${extension}`;
    const uploadDir = process.env.UPLOADS_DIR || path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), Buffer.from(await entry.arrayBuffer()), { flag: "wx" });

    return NextResponse.json({ url: `/uploads/${filename}`, filename, size: entry.size, type: entry.type });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "No se pudo guardar el archivo" }, { status: 500 });
  }
}


