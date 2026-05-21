/**
 * Worker process bootstrap.
 *
 * Run as a SEPARATE Node process (not inside the Next.js server):
 *   npm run worker
 *
 * This file registers an empty BullMQ Worker for every named queue declared in
 * `./queues`. Each worker currently logs the received job and returns — module
 * owners (`results-ingestion`, `notifications`) will replace the processor
 * functions with real implementations as those features land.
 *
 * Graceful shutdown:
 *   On SIGTERM / SIGINT we stop accepting new jobs, wait for in-flight jobs to
 *   finish, close every queue, and disconnect the shared Redis client before
 *   exiting. This makes the process safe to run under Docker / PM2 / k8s.
 */
import 'dotenv/config';

import { Worker, type Job, type Processor } from 'bullmq';

import { redis, redisConnectionOptions } from './redis';
import { closeAllQueues } from './queueFactory';
import {
  QUEUE_NAMES,
  type NotificationsJobPayload,
  type ResultsPollingJobPayload,
} from './queues';

const log = (...args: unknown[]): void => {
  // eslint-disable-next-line no-console
  console.info('[worker]', ...args);
};

const resultsPollingProcessor: Processor<ResultsPollingJobPayload> = async (
  job: Job<ResultsPollingJobPayload>,
) => {
  log(`results-polling job received id=${job.id} name=${job.name}`);
  // TODO(results-ingestion): poll API-Football and enqueue scoring jobs.
};

const notificationsProcessor: Processor<NotificationsJobPayload> = async (
  job: Job<NotificationsJobPayload>,
) => {
  log(`notifications job received id=${job.id} name=${job.name}`);
  // TODO(notifications): dispatch via the configured channel.
};

const workers: Worker[] = [
  new Worker<ResultsPollingJobPayload>(
    QUEUE_NAMES.resultsPolling,
    resultsPollingProcessor,
    { connection: redisConnectionOptions },
  ),
  new Worker<NotificationsJobPayload>(
    QUEUE_NAMES.notifications,
    notificationsProcessor,
    { connection: redisConnectionOptions },
  ),
];

workers.forEach((worker) => {
  worker.on('ready', () => log(`worker ready: ${worker.name}`));
  worker.on('failed', (job, err) => {
    // eslint-disable-next-line no-console
    console.error(
      `[worker] job failed queue=${worker.name} id=${job?.id ?? 'unknown'}:`,
      err.message,
    );
  });
  worker.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error(`[worker] worker error queue=${worker.name}:`, err.message);
  });
});

log(
  `bootstrapped ${workers.length} worker(s): ${workers
    .map((w) => w.name)
    .join(', ')}`,
);

let shuttingDown = false;

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  if (shuttingDown) return;
  shuttingDown = true;
  log(`received ${signal}, shutting down gracefully...`);

  try {
    await Promise.all(workers.map((w) => w.close()));
    await closeAllQueues();
    await redis.quit();
    log('shutdown complete');
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[worker] error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
process.on('SIGINT', () => {
  void shutdown('SIGINT');
});
