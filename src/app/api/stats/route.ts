import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentOrg } from '@/lib/auth';
import { startOfMonth, startOfWeek, subDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth();
    const org = await getCurrentOrg();
    if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

    const now = new Date();
    const monthStart = startOfMonth(now);
    const weekStart = startOfWeek(now);
    const thirtyDaysAgo = subDays(now, 30);

    // 1. Recaps sent this month
    const recapsSentThisMonth = await prisma.recap.count({
      where: {
        org_id: org.id,
        status: { in: ['SENT', 'CONFIRMED'] },
        sent_at: { gte: monthStart },
      },
    });

    // 2. Pending recaps
    const pendingRecapsCount = await prisma.recap.count({
      where: {
        org_id: org.id,
        status: 'DRAFT',
      },
    });

    // 3. Confirmation rate
    const totalSent = await prisma.recap.count({
      where: {
        org_id: org.id,
        status: { in: ['SENT', 'CONFIRMED'] },
      },
    });
    const confirmedCount = await prisma.recap.count({
      where: {
        org_id: org.id,
        status: 'CONFIRMED',
      },
    });
    const confirmationRatePercent = totalSent > 0 ? (confirmedCount / totalSent) * 100 : 0;

    // 4. Time saved calculation (mock: 1.5 hours per confirmed recap)
    const timeSavedThisWeekHours = confirmedCount * 1.5; // Simplification for demo

    // 5. Recaps by day (last 30 days)
    const recapsByDayRaw = await prisma.$queryRaw`
      SELECT DATE(created_at) as date, COUNT(*)::int as count
      FROM recaps
      WHERE org_id = ${org.id} AND created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    return NextResponse.json({
      recaps_sent_this_month: recapsSentThisMonth,
      time_saved_this_week_hours: timeSavedThisWeekHours,
      confirmation_rate_percent: Math.round(confirmationRatePercent),
      pending_recaps_count: pendingRecapsCount,
      recaps_by_day: recapsByDayRaw,
    });
  } catch (error: any) {
    console.error('Stats Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
