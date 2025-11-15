/**
 * Job Service - Background job processing with BullMQ
 */

import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import type { Logger } from 'pino';
import type { JobData } from '../types/api';

export class JobService {
  private queues: Map<string, Queue>;
  private workers: Map<string, Worker>;

  constructor(
    private redis: Redis,
    private logger: Logger
  ) {
    this.queues = new Map();
    this.workers = new Map();
    this.initializeQueues();
  }

  /**
   * Initialize job queues
   */
  private initializeQueues() {
    const queueNames = [
      'feed-ingest',
      'article-summarize',
      'cache-cleanup',
      'feed-refresh',
      'email-send',
    ];

    for (const name of queueNames) {
      const queue = new Queue(name, {
        connection: this.redis,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: {
            count: 100,
            age: 86400, // 24 hours
          },
          removeOnFail: {
            count: 500,
            age: 604800, // 7 days
          },
        },
      });

      this.queues.set(name, queue);
      this.logger.info({ queue: name }, 'Queue initialized');
    }
  }

  /**
   * Add a job to a queue
   */
  async addJob(jobData: JobData): Promise<Job> {
    const queueName = this.getQueueName(jobData.type);
    const queue = this.queues.get(queueName);

    if (!queue) {
      throw new Error(`Queue not found: ${queueName}`);
    }

    const job = await queue.add(jobData.type, jobData.payload, jobData.options);

    this.logger.info({
      jobId: job.id,
      type: jobData.type,
      queue: queueName,
    }, 'Job added to queue');

    return job;
  }

  /**
   * Start a worker for a specific queue
   */
  startWorker(
    queueName: string,
    processor: (job: Job) => Promise<any>
  ): Worker {
    const worker = new Worker(queueName, processor, {
      connection: this.redis,
      concurrency: parseInt(process.env.JOB_CONCURRENCY || '5'),
    });

    worker.on('completed', (job) => {
      this.logger.info({
        jobId: job.id,
        queue: queueName,
        duration: job.finishedOn ? job.finishedOn - (job.processedOn || 0) : 0,
      }, 'Job completed');
    });

    worker.on('failed', (job, error) => {
      this.logger.error({
        jobId: job?.id,
        queue: queueName,
        error: error.message,
        attempts: job?.attemptsMade,
      }, 'Job failed');
    });

    worker.on('error', (error) => {
      this.logger.error({
        queue: queueName,
        error: error.message,
      }, 'Worker error');
    });

    this.workers.set(queueName, worker);
    this.logger.info({ queue: queueName }, 'Worker started');

    return worker;
  }

  /**
   * Get queue by name
   */
  getQueue(name: string): Queue | undefined {
    return this.queues.get(name);
  }

  /**
   * Get worker by name
   */
  getWorker(name: string): Worker | undefined {
    return this.workers.get(name);
  }

  /**
   * Get queue name from job type
   */
  private getQueueName(type: JobData['type']): string {
    const mapping: Record<JobData['type'], string> = {
      FEED_INGEST: 'feed-ingest',
      ARTICLE_SUMMARIZE: 'article-summarize',
      CACHE_CLEANUP: 'cache-cleanup',
      FEED_REFRESH: 'feed-refresh',
      EMAIL_SEND: 'email-send',
    };

    return mapping[type];
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(queueName: string) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue not found: ${queueName}`);
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  }

  /**
   * Get all queue statistics
   */
  async getAllQueueStats() {
    const stats: Record<string, any> = {};

    for (const [name] of this.queues.entries()) {
      stats[name] = await this.getQueueStats(name);
    }

    return stats;
  }

  /**
   * Pause a queue
   */
  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue not found: ${queueName}`);
    }

    await queue.pause();
    this.logger.info({ queue: queueName }, 'Queue paused');
  }

  /**
   * Resume a queue
   */
  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue not found: ${queueName}`);
    }

    await queue.resume();
    this.logger.info({ queue: queueName }, 'Queue resumed');
  }

  /**
   * Clean completed jobs from a queue
   */
  async cleanQueue(queueName: string, grace: number = 86400000): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue not found: ${queueName}`);
    }

    await queue.clean(grace, 100, 'completed');
    await queue.clean(grace * 7, 100, 'failed'); // Keep failed jobs longer

    this.logger.info({ queue: queueName, grace }, 'Queue cleaned');
  }

  /**
   * Close all queues and workers
   */
  async close(): Promise<void> {
    this.logger.info('Closing job service...');

    // Close all workers
    for (const [name, worker] of this.workers.entries()) {
      await worker.close();
      this.logger.info({ worker: name }, 'Worker closed');
    }

    // Close all queues
    for (const [name, queue] of this.queues.entries()) {
      await queue.close();
      this.logger.info({ queue: name }, 'Queue closed');
    }

    this.logger.info('Job service closed');
  }
}
