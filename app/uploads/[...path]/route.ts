import { handleServeUpload } from '@/lib/serveUpload';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  props: { params: Promise<{ path: string[] }> }
) {
  return handleServeUpload(request, props?.params);
}

export async function HEAD(
  request: Request,
  props: { params: Promise<{ path: string[] }> }
) {
  return handleServeUpload(request, props?.params);
}
