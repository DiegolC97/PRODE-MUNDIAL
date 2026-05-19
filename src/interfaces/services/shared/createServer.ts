/**
 * Common Express bootstrap used by every microservice.
 * Centralises body parsing, health endpoints, error formatting and logging.
 */
import express, { type Express, type NextFunction, type Request, type Response } from 'express';

export function createServer(serviceName: string): Express {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: serviceName, timestamp: new Date().toISOString() });
  });

  // Generic error handler — must be registered AFTER routes by the caller.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = err instanceof Error ? err.message : 'Internal error';
    console.error(`[${serviceName}] error:`, err);
    res.status(500).json({ error: message });
  });

  return app;
}

export function startServer(app: Express, port: number, serviceName: string): void {
  app.listen(port, () => {
    console.info(`[${serviceName}] listening on http://0.0.0.0:${port}`);
  });

  const shutdown = (signal: string) => {
    console.info(`[${serviceName}] received ${signal}, shutting down`);
    process.exit(0);
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
