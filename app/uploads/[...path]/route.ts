import { stat, readFile, open } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

async function findFilePath(filename: string): Promise<string | null> {
  const candidateDirs = [
    path.join(process.cwd(), "public", "uploads"),
    path.join("/app", "public", "uploads"),
    path.join("/var", "www", "uploads"),
    path.join(process.cwd(), ".next", "standalone", "public", "uploads"),
  ];

  for (const dir of candidateDirs) {
    try {
      const fullPath = path.join(dir, filename);
      if (existsSync(fullPath)) {
        return fullPath;
      }
    } catch {}
  }
  return null;
}

export async function GET(
  request: Request,
  props: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await props.params;
    const pathParts = params?.path || [];
    let filename = pathParts.join("/");

    if (!filename) {
      return new Response("Nombre de archivo no proporcionado", { status: 400 });
    }

    try {
      filename = decodeURIComponent(filename);
    } catch {}

    // Prevenir Directory Traversal
    filename = path.normalize(filename).replace(/^(\.\.[\/\\])+/, "");
    if (filename.startsWith("/") || filename.includes("..")) {
      return new Response("Ruta inválida", { status: 400 });
    }

    const filepath = await findFilePath(filename);
    if (!filepath) {
      // 404 limpio si no existe, nunca 500
      return new Response("Archivo no encontrado", { status: 404 });
    }

    const fileStat = await stat(filepath);
    const fileSize = fileStat.size;
    const ext = path.extname(filename).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    // Soporte para Range requests (video y audio)
    const rangeHeader = request.headers.get("range");
    if (rangeHeader && rangeHeader.startsWith("bytes=")) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const rawStart = parts[0]?.trim();
      const rawEnd = parts[1]?.trim();

      let start = rawStart ? parseInt(rawStart, 10) : 0;
      let end = rawEnd ? parseInt(rawEnd, 10) : Math.min(start + 2 * 1024 * 1024 - 1, fileSize - 1);

      if (isNaN(start) || start < 0) start = 0;
      if (isNaN(end) || end >= fileSize) end = fileSize - 1;

      if (start >= fileSize || start > end) {
        return new Response(null, {
          status: 416,
          headers: {
            "Content-Range": `bytes */${fileSize}`,
          },
        });
      }

      const chunkSize = end - start + 1;
      const fileHandle = await open(filepath, "r");
      try {
        const buffer = Buffer.alloc(chunkSize);
        await fileHandle.read(buffer, 0, chunkSize, start);
        return new Response(buffer, {
          status: 206,
          statusText: "Partial Content",
          headers: {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize.toString(),
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } finally {
        await fileHandle.close().catch(() => {});
      }
    }

    // Respuesta completa para imágenes y documentos
    const fileBuffer = await readFile(filepath);
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Length": fileSize.toString(),
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    console.error("Error al servir archivo subido:", err?.message || err);
    return new Response("Error interno del servidor", { status: 500 });
  }
}

export async function HEAD(
  request: Request,
  props: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await props.params;
    const pathParts = params?.path || [];
    let filename = pathParts.join("/");
    if (!filename) return new Response("Nombre de archivo no proporcionado", { status: 400 });

    try {
      filename = decodeURIComponent(filename);
    } catch {}

    filename = path.normalize(filename).replace(/^(\.\.[\/\\])+/, "");
    const filepath = await findFilePath(filename);
    if (!filepath) return new Response("Archivo no encontrado", { status: 404 });

    const fileStat = await stat(filepath);
    const ext = path.extname(filename).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new Response(null, {
      status: 200,
      headers: {
        "Content-Length": fileStat.size.toString(),
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response("Error interno del servidor", { status: 500 });
  }
}
