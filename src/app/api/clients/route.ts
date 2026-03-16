import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentOrg } from '@/lib/auth';
import { createClientSchema, paginationSchema } from '@/lib/validations';

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

    const clients = await prisma.client.findMany({
      where: {
        org_id: org.id,
        deleted_at: null,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    });

    const total = await prisma.client.count({
      where: {
        org_id: org.id,
        deleted_at: null,
      },
    });

    return NextResponse.json({
      data: clients,
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
    const org = await getCurrentOrg();
    if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

    const body = await req.json();
    const validatedData = createClientSchema.parse(body);

    const client = await prisma.client.create({
      data: {
        ...validatedData,
        org_id: org.id,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
