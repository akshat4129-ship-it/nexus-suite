import { Queue, Worker, QueueEvents, Job } from 'bullmq';
import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6381';
const connection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const QUEUE_NAMES = {
  RECAP_PIPELINE: 'recap-pipeline',
  CRM_SYNC: 'crm-sync',
  DAILY_DIGEST: 'daily-digest',
  MEETING_DETECTION: 'meeting-detection',
} as const;

// Queue Instances
export const queues = {
  recapPipeline: new Queue(QUEUE_NAMES.RECAP_PIPELINE, { connection }),
  crmSync: new Queue(QUEUE_NAMES.CRM_SYNC, { connection }),
  dailyDigest: new Queue(QUEUE_NAMES.DAILY_DIGEST, { connection }),
  meetingDetection: new Queue(QUEUE_NAMES.MEETING_DETECTION, { connection }),
};

// Types for Job Data
export interface JobData {
  recapPipeline: { meetingId: string; step?: 'TRANSCRIPTION' | 'GENERATION' | 'SEND' | 'CHECK_CONFIRMATION' };
  crmSync: { recapId: string };
  dailyDigest: { orgId?: string };
  meetingDetection: { orgId?: string };
}

/**
 * Singleton service to manage enqueuing jobs
 */
export const QueueService = {
  async enqueueRecap(meetingId: string) {
    return queues.recapPipeline.add('start-recap', { meetingId }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });
  },

  async enqueueCrmSync(recapId: string) {
    return queues.crmSync.add('sync-recap', { recapId }, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 10000 },
    });
  },

  async scheduleDailyDigest() {
    // Repeat every day at 8 AM
    return queues.dailyDigest.add('daily-digest', {}, {
      repeat: { pattern: '0 8 * * *' },
    });
  },

  async scheduleMeetingDetection() {
    // Repeat every 15 minutes
    return queues.meetingDetection.add('detect-meetings', {}, {
      repeat: { every: 15 * 60 * 1000 },
    });
  },

  /**
   * Add a job with a specific delay (e.g., "Check confirmation in 48 hours")
   */
  async enqueueWithDelay(queueName: keyof typeof queues, name: string, data: any, delayMs: number) {
    return queues[queueName].add(name, data, { delay: delayMs });
  }
};
