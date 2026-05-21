/**
 * Public barrel for the shared queue layer.
 *
 * Import from `@/shared/queue` rather than reaching into submodules directly.
 */
export { redis, redisConnectionOptions } from './redis';
export { createQueue, closeAllQueues } from './queueFactory';
export type { CreateQueueOptions } from './queueFactory';
export {
  QUEUE_NAMES,
  resultsPollingQueue,
  notificationsQueue,
} from './queues';
export type {
  QueueName,
  ResultsPollingJobPayload,
  NotificationsJobPayload,
} from './queues';
