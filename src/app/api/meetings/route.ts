import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentOrg, getCurrentUser } from '@/lib/auth';
import { createMeetingSchema, paginationSchema } from '@/lib/validations';
import { MeetingStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await requireAuth();
    const org = await getCurrentOrg();
    if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const { page, limit } = paginationSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });
    
    const status = searchParams.get('status') as MeetingStatus | null;

    const meetings = await prisma.meeting.findMany({
      where: {
        org_id: org.id,
        deleted_at: null,
        ...(status && { status }),
      },
      include: {
        client: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { scheduled_at: 'desc' },
    });

    const total = await prisma.meeting.count({
      where: {
        org_id: org.id,
        deleted_at: null,
        ...(status && { status }),
      },
    });

    return NextResponse.json({
      data: meetings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth();
    const user = await getCurrentUser();
    const org = user?.organization;
    if (!org || !user) return NextResponse.json({ error: 'Org/User not found' }, { status: 404 });

    const body = await req.json();
    const validatedData = createMeetingSchema.parse(body);

    const meeting = await prisma.meeting.create({
      data: {
        ...validatedData,
        scheduled_at: validatedData.scheduled_at ? new Date(validatedData.scheduled_at) : null,
        org_id: org.id,
        user_id: user.id,
        status: 'SCHEDULED',
      },
    });

    return NextResponse.json(meeting, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
