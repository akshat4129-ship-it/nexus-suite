import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentOrg } from '@/lib/auth';
import { scheduleRecapSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await requireAuth();
    const org = await getCurrentOrg();
    if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

    const body = await req.json();
    const { scheduled_send_at } = scheduleRecapSchema.parse(body);

    const existing = await prisma.recap.findFirst({
      where: { id, org_id: org.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Recap not found' }, { status: 404 });
    }

    const recap = await prisma.recap.update({
      where: { id },
      data: {
        scheduled_send_at: new Date(scheduled_send_at),
        status: 'SCHEDULED',
      },
    });

    return NextResponse.json(recap);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
