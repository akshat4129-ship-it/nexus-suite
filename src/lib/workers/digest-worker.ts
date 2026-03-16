import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { QUEUE_NAMES } from '../queue-service';
import { prisma } from '../prisma';
import axios from 'axios';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6381';
const connection = new Redis(REDIS_URL, { maxRetriesPerRequest: null });

/**
 * Worker for Daily Digest: aggregations and morning reports
 */
export const digestWorker = new Worker(
  QUEUE_NAMES.DAILY_DIGEST,
  async (job: Job) => {
    const { orgId } = job.data;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005';

    console.log(`[DigestWorker] Processing digest ${orgId ? `for org ${orgId}` : 'for all orgs'}`);

    try {
      if (orgId) {
        // Implementation for single org
        // Trigger internal digest API or service
        return { status: 'DIGEST_SENT' };
      } else {
        // Implementation for all active orgs
        const orgs = await prisma.organization.findMany({
            where: { is_active: true }
        });
        
        for (const org of orgs) {
            // Re-enqueue for specific org
            await job.queue.add('org-digest', { orgId: org.id });
        }
        return { totalOrgs: orgs.length };
      }
    } catch (error: any) {
      console.error(`[DigestWorker] Failed:`, error.message);
      throw error;
    }
  },
  { connection }
);
