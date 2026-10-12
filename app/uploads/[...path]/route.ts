import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const CONTENT_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
};

export const dynamic = "force-dynamic";

const uploadRoot = () => path.resolve(process.env.UPLOADS_DIR || path.join(process.cwd(), "public/uploads"));

function safeFilePath(parts: string[]) {
  const root = uploadRoot();
  const requested = path.resolve(root, ...parts);
  return requested === root || requested.startsWith(`${root}${path.sep}`) ? requested : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: parts } = await params;
  const filePath = safeFilePath(parts);

  if (!filePath) return new NextResponse("Not found", { status: 404 });

  try {
    const file = await fs.readFile(filePath);
    const contentType = CONTENT_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
    if (code === "ENOENT" || code === "EISDIR") return new NextResponse("Not found", { status: 404 });
    console.error("Media read error:", error);
    return new NextResponse("Unable to read media", { status: 500 });
  }
}

export async function HEAD(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const response = await GET(request, context);
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers,
  });
}
