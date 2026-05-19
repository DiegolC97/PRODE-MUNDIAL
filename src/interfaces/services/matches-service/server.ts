/**
 * matches-service
 *
 * Owns the lifecycle of Match entities. Exposes:
 *   GET /matches/upcoming?limit=N
 *
 * Pure interface code: parses HTTP → calls use case → serialises response.
 */
import 'dotenv/config';
import express from 'express';
import { buildContainer } from '../../../infrastructure/composition-root';
import { env } from '../../../infrastructure/config/env';
import { createServer, startServer } from '../shared/createServer';

const SERVICE_NAME = 'matches-service';
const PORT = Number(process.env.SERVICE_PORT ?? env.servicePort ?? 4001);

const app = createServer(SERVICE_NAME);
const { useCases } = buildContainer();

const router = express.Router();

router.get('/matches/upcoming', async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const data = await useCases.listUpcomingMatches.execute({ limit });
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

app.use(router);

startServer(app, PORT, SERVICE_NAME);
