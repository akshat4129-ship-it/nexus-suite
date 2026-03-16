import { NextResponse } from 'next/server';
import { QueueService } from '@/lib/queue-service';

/**
 * Daily digest cron - scheduled every morning
 */
export async function GET(req: Request) {
  try {
    // Check for cron secret if needed
    const job = await QueueService.scheduleDailyDigest();
    return NextResponse.json({ success: true, jobId: job.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
