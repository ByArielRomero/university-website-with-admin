import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    // Validar peso (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo es demasiado grande (máximo 50MB)" }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar nombre de archivo único y seguro
    const ext = path.extname(file.name).toLowerCase();
    const basename = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    const filename = `${Date.now()}-${basename || 'archivo'}${ext}`;

    // Directorios posibles para guardar el archivo
    const possibleDirs = [
      path.join(process.cwd(), "public", "uploads"),
      path.join("/app", "public", "uploads"),
      path.join("/var", "www", "uploads"),
    ];

    let savedPath: string | null = null;
    let lastError: any = null;

    for (const dir of possibleDirs) {
      try {
        await mkdir(dir, { recursive: true });
        const targetPath = path.join(dir, filename);
        await writeFile(targetPath, buffer);
        savedPath = targetPath;
        break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!savedPath) {
      console.error("Error al escribir archivo en todos los directorios posibles:", lastError);
      return NextResponse.json(
        { error: `Error de permisos al guardar en disco: ${lastError?.message || "Sin permisos"}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { error: e?.message ? `Error al subir: ${e.message}` : "Upload failed" },
      { status: 500 }
    );
  }
}
