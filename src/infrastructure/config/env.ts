/**
 * Centralised access to environment variables.
 * The rest of infrastructure MUST go through this module — never read
 * process.env directly elsewhere.
 */
function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',

  databaseUrl: required(
    'DATABASE_URL',
    'postgres://prode:prode_secret@localhost:5432/prode_mundial',
  ),

  redisUrl: required('REDIS_URL', 'redis://localhost:6379'),

  matchesServiceUrl: process.env.MATCHES_SERVICE_URL ?? 'http://localhost:4001',
  predictionsServiceUrl: process.env.PREDICTIONS_SERVICE_URL ?? 'http://localhost:4002',
  scoringServiceUrl: process.env.SCORING_SERVICE_URL ?? 'http://localhost:4003',

  servicePort: Number(process.env.SERVICE_PORT ?? 4000),
  serviceName: process.env.SERVICE_NAME ?? 'unknown-service',
};
