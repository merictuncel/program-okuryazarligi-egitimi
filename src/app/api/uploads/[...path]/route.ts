import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Yerel disk dosya sunumu Vercel+Blob'da gerekmez.
 * fs / process.cwd izlemesini tamamen önlemek için burada dosya okunmaz.
 * Lokal geliştirmede dosyalar public/uploads üzerinden statik servis edilir.
 */
export async function GET() {
  return new NextResponse("Not found", { status: 404 });
}
