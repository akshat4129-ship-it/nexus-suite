import { recapWorker } from './recap-worker';
import { crmWorker } from './crm-worker';
import { digestWorker } from './digest-worker';
import { detectionWorker } from './detection-worker';

/**
 * Ensures all workers are initialized and listening
 * In a Next.js environment, this should be called in a way that
 * survives between requests in development.
 */
export const initWorkers = () => {
  if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    if (!global._bullmq_workers) {
      console.log('--- INITIALIZING BULLMQ WORKERS ---');
      // @ts-ignore
      global._bullmq_workers = {
        recapWorker,
        crmWorker,
        digestWorker,
        detectionWorker,
      };
    }
  } else {
    // Production: Workers will be initialized on first import
    // Note: In serverless environments, BullMQ workers should be run 
    // in a separate process/container.
    console.log('--- BULLMQ WORKERS READY ---');
  }
};

export { recapWorker, crmWorker, digestWorker, detectionWorker };
