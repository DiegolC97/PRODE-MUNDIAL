/**
 * BullMQ queue factory.
 *
 * Creates named BullMQ Queues that all share the singleton Redis connection
 * configured in `./redis`. Use this factory instead of instantiating
 * `new Queue(...)` directly so we get:
 *   - a single Redis socket reused across the process,
 *   - consistent default job options (retries, backoff, cleanup),
 *   - typed payloads via the generic parameter.
 *
 * Usage:
 *   const myQueue = createQueue<MyJobPayload>('my-queue');
 *   await myQueue.add('do-thing', { foo: 'bar' });
 */
import { Queue, type QueueOptions, type DefaultJobOptions } from 'bullmq';

import { redis } from './redis';

const defaultJobOptions: DefaultJobOptions = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5_000 },
  removeOnComplete: { age: 60 * 60, count: 1_000 },
  removeOnFail: { age: 24 * 60 * 60 },
};

const queueRegistry = new Map<string, Queue>();

export interface CreateQueueOptions extends Omit<QueueOptions, 'connection'> {
  /**
   * Override the default job options for this queue.
   */
  defaultJobOptions?: DefaultJobOptions;
}

/**
 * Create (or return the existing) named BullMQ Queue. Calling this multiple
 * times with the same `name` returns the same instance.
 */
export const createQueue = <TPayload = unknown, TResult = unknown, TName extends string = string>(
  name: string,
  options: CreateQueueOptions = {},
): Queue<TPayload, TResult, TName> => {
  const existing = queueRegistry.get(name);
  if (existing) {
    return existing as Queue<TPayload, TResult, TName>;
  }

  const queue = new Queue<TPayload, TResult, TName>(name, {
    connection: redis,
    ...options,
    defaultJobOptions: {
      ...defaultJobOptions,
      ...(options.defaultJobOptions ?? {}),
    },
  });

  queueRegistry.set(name, queue);
  return queue;
};

/**
 * Close every queue created through this factory. Used by the worker
 * bootstrap during graceful shutdown.
 */
export const closeAllQueues = async (): Promise<void> => {
  const queues = Array.from(queueRegistry.values());
  queueRegistry.clear();
  await Promise.all(queues.map((q) => q.close()));
};
