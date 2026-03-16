import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentOrg } from '@/lib/auth';
import { updateTemplateSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await requireAuth();
    const org = await getCurrentOrg();
    if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

    const body = await req.json();
    const validatedData = updateTemplateSchema.parse(body);

    const existing = await prisma.recapTemplate.findFirst({
      where: { id, org_id: org.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // If is_default is changing to true, unset others
    if (validatedData.is_default === true) {
      await prisma.recapTemplate.updateMany({
        where: { org_id: org.id, is_default: true, id: { not: id } },
        data: { is_default: false },
      });
    }

    const template = await prisma.recapTemplate.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(template);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await requireAuth();
    const org = await getCurrentOrg();
    if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

    const existing = await prisma.recapTemplate.findFirst({
      where: { id, org_id: org.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    await prisma.recapTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
