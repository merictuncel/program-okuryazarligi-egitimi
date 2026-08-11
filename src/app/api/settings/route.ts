import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJsonBody } from "@/lib/api";
import { requireAdminSession } from "@/lib/session";
import { siteSettingsSchema } from "@/lib/validations";

export async function GET() {
  const settings = await prisma.siteSettings.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(settings ?? null);
}

export async function PUT(request: Request) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const parsed = await parseJsonBody(request, siteSettingsSchema);
  if ("response" in parsed) return parsed.response;

  const existing = await prisma.siteSettings.findFirst();

  const settings = existing
    ? await prisma.siteSettings.update({
        where: { id: existing.id },
        data: parsed.data,
      })
    : await prisma.siteSettings.create({
        data: parsed.data,
      });

  return NextResponse.json(settings);
}
