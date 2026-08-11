import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJsonBody } from "@/lib/api";
import { requireAdminSession } from "@/lib/session";
import { announcementSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const auth = await requireAdminSession();
  const wantsAll = searchParams.get("all") === "true";

  // Public: yalnızca aktif. Tam liste yalnız admin + all=true.
  const where =
    auth.session && wantsAll ? undefined : { isActive: true };

  const announcements = await prisma.announcement.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json(announcements);
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const parsed = await parseJsonBody(request, announcementSchema);
  if ("response" in parsed) return parsed.response;

  const announcement = await prisma.announcement.create({
    data: {
      ...parsed.data,
      publishedAt: parsed.data.publishedAt ?? new Date(),
    },
  });

  return NextResponse.json(announcement, { status: 201 });
}
