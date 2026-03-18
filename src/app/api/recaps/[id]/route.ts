import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentOrg } from '@/lib/auth';
import { updateRecapSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await requireAuth();
    const org = await getCurrentOrg();
    if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

    const recap = await prisma.recap.findFirst({
      where: {
        id,
        org_id: org.id,
        deleted_at: null,
      },
      include: {
        client: true,
        meeting: {
          include: {
            transcript: true,
          }
        },
        action_items: true,
        email_events: {
          orderBy: { occurred_at: 'desc' },
        },
      },
    });

    if (!recap) {
      return NextResponse.json({ error: 'Recap not found' }, { status: 404 });
    }

    return NextResponse.json(recap);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
    const validatedData = updateRecapSchema.parse(body);

    const existing = await prisma.recap.findFirst({
      where: { id, org_id: org.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Recap not found' }, { status: 404 });
    }

    const recap = await prisma.recap.update({
      where: { id },
      data: {
        ...validatedData,
        next_meeting_at: validatedData.next_meeting_at ? new Date(validatedData.next_meeting_at) : undefined,
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
