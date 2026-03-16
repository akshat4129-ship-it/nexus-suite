import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { QUEUE_NAMES } from '../queue-service';
import axios from 'axios';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6381';
const connection = new Redis(REDIS_URL, { maxRetriesPerRequest: null });

/**
 * Worker for Meeting Detection: Google Calendar sync
 */
export const detectionWorker = new Worker(
  QUEUE_NAMES.MEETING_DETECTION,
  async (job: Job) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005';
    console.log(`[DetectionWorker] Syncing calendars...`);

    try {
      // Trigger the existing calendar sync route
      await axios.get(`${appUrl}/api/meetings/sync`);
      return { status: 'SYNC_COMPLETE' };
    } catch (error: any) {
      console.error(`[DetectionWorker] Sync failed:`, error.response?.data || error.message);
      throw error;
    }
  },
  { connection }
);
