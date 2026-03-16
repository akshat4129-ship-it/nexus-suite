import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentOrg } from '@/lib/auth';
import { createTemplateSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await requireAuth();
    const org = await getCurrentOrg();
    if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

    const templates = await prisma.recapTemplate.findMany({
      where: {
        org_id: org.id,
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(templates);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth();
    const org = await getCurrentOrg();
    if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

    const body = await req.json();
    const validatedData = createTemplateSchema.parse(body);

    // If is_default is true, unset other defaults
    if (validatedData.is_default) {
      await prisma.recapTemplate.updateMany({
        where: { org_id: org.id, is_default: true },
        data: { is_default: false },
      });
    }

    const template = await prisma.recapTemplate.create({
      data: {
        ...validatedData,
        org_id: org.id,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
