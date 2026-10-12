import { stat, readFile, open } from 'fs/promises';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

export async function handleServeUpload(
  request: Request,
  rawParams?: any
): Promise<Response> {
  try {
    const params = rawParams ? (rawParams instanceof Promise ? await rawParams : rawParams) : {};

    let filename: string | undefined = params?.filename;
    if (!filename && params?.path) {
      filename = Array.isArray(params.path) ? params.path[params.path.length - 1] : params.path;
    }

    if (!filename) {
      try {
        const url = new URL(request.url);
        const parts = url.pathname.split('/').filter(Boolean);
        filename = parts[parts.length - 1];
      } catch {}
    }

    if (!filename) {
      return new Response('Invalid filename', { status: 400 });
    }

    try {
      filename = decodeURIComponent(filename);
    } catch {}

    filename = path.basename(filename);

    if (!filename || filename === '.' || filename === '..') {
      return new Response('Invalid filename', { status: 400 });
    }

    // Try finding the file in process.cwd()/public/uploads or fallback paths
    let uploadDir = path.join(process.cwd(), 'public', 'uploads');
    let filepath = path.join(uploadDir, filename);

    let fileStat;
    try {
      fileStat = await stat(filepath);
    } catch {
      const fallbackPath = path.join('/app', 'public', 'uploads', filename);
      try {
        fileStat = await stat(fallbackPath);
        filepath = fallbackPath;
      } catch {
        return new Response('File not found', { status: 404 });
      }
    }

    const fileSize = fileStat.size;
    const ext = path.extname(filename).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Handle HEAD requests (useful for video players probing size and byte range support)
    if (request.method === 'HEAD') {
      return new Response(null, {
        status: 200,
        headers: {
          'Content-Length': fileSize.toString(),
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    const rangeHeader = request.headers.get('range');

    // Handle HTTP Range requests for video/audio streaming and seeking
    if (rangeHeader && rangeHeader.startsWith('bytes=')) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const rawStart = parts[0]?.trim();
      const rawEnd = parts[1]?.trim();

      let start = rawStart ? parseInt(rawStart, 10) : 0;
      let end = rawEnd ? parseInt(rawEnd, 10) : Math.min(start + 2 * 1024 * 1024 - 1, fileSize - 1); // 2MB chunk

      if (isNaN(start) || start < 0) start = 0;
      if (isNaN(end) || end >= fileSize) end = fileSize - 1;

      if (start >= fileSize || start > end) {
        return new Response(null, {
          status: 416,
          headers: {
            'Content-Range': `bytes */${fileSize}`,
          },
        });
      }

      const chunkSize = end - start + 1;
      const fileHandle = await open(filepath, 'r');
      try {
        const buffer = Buffer.alloc(chunkSize);
        await fileHandle.read(buffer, 0, chunkSize, start);
        return new Response(buffer, {
          status: 206,
          statusText: 'Partial Content',
          headers: {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize.toString(),
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      } finally {
        await fileHandle.close().catch(() => {});
      }
    }

    // Full file serving (for images, documents, or full requests)
    const fileBuffer = await readFile(filepath);
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Length': fileSize.toString(),
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    console.error('Error serving upload:', err?.message || err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
