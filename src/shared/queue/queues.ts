/**
 * Named queue stubs.
 *
 * Each queue declared here is an empty stub: producers/consumers will be wired
 * up by the owning module (`results-ingestion`, `notifications`). The queue
 * name constants are the source of truth — workers and producers must import
 * them from this file rather than typing the string literal.
 */
import type { Queue } from 'bullmq';

import { createQueue } from './queueFactory';

export const QUEUE_NAMES = {
  resultsPolling: 'results-polling',
  notifications: 'notifications',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

/**
 * Payload contract for the results-polling queue. Owned by the
 * `results-ingestion` module; kept here so producers in other modules and the
 * worker bootstrap can share the type. Refine when the module is implemented.
 */
export interface ResultsPollingJobPayload {
  matchId?: string;
  reason?: string;
}

/**
 * Payload contract for the notifications queue. Owned by the `notifications`
 * module. Refine when the module is implemented.
 */
export interface NotificationsJobPayload {
  userId?: string;
  channel?: 'email' | 'push' | 'inapp';
  templateId?: string;
  data?: Record<string, unknown>;
}

export const resultsPollingQueue: Queue<ResultsPollingJobPayload> =
  createQueue<ResultsPollingJobPayload>(QUEUE_NAMES.resultsPolling);

export const notificationsQueue: Queue<NotificationsJobPayload> =
  createQueue<NotificationsJobPayload>(QUEUE_NAMES.notifications);
