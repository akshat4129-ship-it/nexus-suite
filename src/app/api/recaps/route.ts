import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentOrg } from '@/lib/auth';
import { paginationSchema } from '@/lib/validations';

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

    const recaps = await prisma.recap.findMany({
      where: {
        org_id: org.id,
        deleted_at: null,
      },
      include: {
        client: true,
        meeting: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' },
    });

    const total = await prisma.recap.count({
      where: {
        org_id: org.id,
        deleted_at: null,
      },
    });

    return NextResponse.json({
      data: recaps,
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
