import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentOrg } from '@/lib/auth';
import { updateMeetingSchema } from '@/lib/validations';

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

    const meeting = await prisma.meeting.findFirst({
      where: {
        id,
        org_id: org.id,
        deleted_at: null,
      },
      include: {
        client: true,
        transcript: true,
        recap: {
          include: {
            action_items: true,
          }
        },
        attendees: true,
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    return NextResponse.json(meeting);
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
    const validatedData = updateMeetingSchema.parse(body);

    const existing = await prisma.meeting.findFirst({
      where: { id, org_id: org.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    const meeting = await prisma.meeting.update({
      where: { id },
      data: {
        ...validatedData,
        scheduled_at: validatedData.scheduled_at ? new Date(validatedData.scheduled_at) : undefined,
      },
    });

    return NextResponse.json(meeting);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
