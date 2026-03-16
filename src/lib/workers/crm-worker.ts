import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { QUEUE_NAMES } from '../queue-service';
import axios from 'axios';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6381';
const connection = new Redis(REDIS_URL, { maxRetriesPerRequest: null });

/**
 * Worker for CRM Sync: recap confirmed -> sync to HubSpot/Salesforce
 */
export const crmWorker = new Worker(
  QUEUE_NAMES.CRM_SYNC,
  async (job: Job) => {
    const { recapId } = job.data;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005';

    console.log(`[CRMWorker] Syncing recap ${recapId}`);

    try {
      // Trigger CRM Sync endpoint
      await axios.post(`${appUrl}/api/integrations/crm/sync/${recapId}`);
      return { status: 'SYNCED' };
    } catch (error: any) {
      console.error(`[CRMWorker] Error syncing recap ${recapId}:`, error.response?.data || error.message);
      throw error;
    }
  },
  { connection }
);

crmWorker.on('completed', (job) => {
  console.log(`[CRMWorker] Job ${job.id} completed`);
});
