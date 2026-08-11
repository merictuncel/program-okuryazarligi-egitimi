import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJsonBody } from "@/lib/api";
import { requireAdminSession } from "@/lib/session";
import { instructorUpdateSchema } from "@/lib/validations";
import { z } from "zod";

const idSchema = z.string().cuid("Geçersiz eğitmen kimliği");

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const idResult = idSchema.safeParse(id);
  if (!idResult.success) {
    return NextResponse.json({ error: "Geçersiz kimlik" }, { status: 400 });
  }

  const instructor = await prisma.instructor.findUnique({
    where: { id: idResult.data },
  });

  if (!instructor) {
    return NextResponse.json({ error: "Eğitmen bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(instructor);
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const { id } = await context.params;
  const idResult = idSchema.safeParse(id);
  if (!idResult.success) {
    return NextResponse.json({ error: "Geçersiz kimlik" }, { status: 400 });
  }

  const parsed = await parseJsonBody(request, instructorUpdateSchema);
  if ("response" in parsed) return parsed.response;

  try {
    const instructor = await prisma.instructor.update({
      where: { id: idResult.data },
      data: parsed.data,
    });
    return NextResponse.json(instructor);
  } catch {
    return NextResponse.json({ error: "Eğitmen bulunamadı" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const { id } = await context.params;
  const idResult = idSchema.safeParse(id);
  if (!idResult.success) {
    return NextResponse.json({ error: "Geçersiz kimlik" }, { status: 400 });
  }

  try {
    await prisma.instructor.delete({ where: { id: idResult.data } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Eğitmen bulunamadı" }, { status: 404 });
  }
}
