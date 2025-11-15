/**
 * Cron Jobs - Scheduled background tasks
 */

import { CronJob } from 'cron';
import type { Logger } from 'pino';
import type { JobService } from './job-service';

/**
 * Start all cron jobs
 */
export async function startCronJobs(jobService: JobService, logger: Logger) {
  logger.info('Starting cron jobs...');

  // Feed refresh job - runs every 30 minutes
  const feedRefreshJob = new CronJob(
    process.env.FEED_REFRESH_INTERVAL || '*/30 * * * *',
    async () => {
      logger.info('Running feed refresh job');
      
      try {
        await jobService.addJob({
          type: 'FEED_REFRESH',
          payload: {},
        });
      } catch (error) {
        logger.error({ error }, 'Feed refresh job failed');
      }
    },
    null,
    true,
    'UTC'
  );

  // Cache cleanup job - runs daily at 2 AM
  const cacheCleanupJob = new CronJob(
    process.env.CACHE_CLEANUP_INTERVAL || '0 2 * * *',
    async () => {
      logger.info('Running cache cleanup job');
      
      try {
        await jobService.addJob({
          type: 'CACHE_CLEANUP',
          payload: {},
        });
      } catch (error) {
        logger.error({ error }, 'Cache cleanup job failed');
      }
    },
    null,
    true,
    'UTC'
  );

  logger.info('Cron jobs started successfully');

  return {
    feedRefreshJob,
    cacheCleanupJob,
  };
}

/**
 * Stop all cron jobs
 */
export function stopCronJobs(jobs: {
  feedRefreshJob: CronJob;
  cacheCleanupJob: CronJob;
}) {
  jobs.feedRefreshJob.stop();
  jobs.cacheCleanupJob.stop();
}
