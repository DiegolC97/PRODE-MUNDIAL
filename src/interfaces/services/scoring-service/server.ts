/**
 * scoring-service
 *
 * When a match finishes, this service is called to apply the scoring policy
 * to every prediction for that match.
 *
 * Exposes:
 *   POST /matches/:matchId/score   { finalHome, finalAway }
 */
import 'dotenv/config';
import express from 'express';
import { z } from 'zod';
import { buildContainer } from '../../../infrastructure/composition-root';
import { env } from '../../../infrastructure/config/env';
import { EntityNotFoundError } from '../../../domain/errors/DomainErrors';
import { createServer, startServer } from '../shared/createServer';

const SERVICE_NAME = 'scoring-service';
const PORT = Number(process.env.SERVICE_PORT ?? env.servicePort ?? 4003);

const app = createServer(SERVICE_NAME);
const { useCases } = buildContainer();

const ScoreSchema = z.object({
  finalHome: z.number().int().min(0).max(99),
  finalAway: z.number().int().min(0).max(99),
});

const router = express.Router();

router.post('/matches/:matchId/score', async (req, res, next) => {
  const parsed = ScoreSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }

  try {
    const result = await useCases.scoreMatchPredictions.execute({
      matchId: req.params.matchId,
      finalHome: parsed.data.finalHome,
      finalAway: parsed.data.finalAway,
    });
    res.json({ data: result });
  } catch (err) {
    if (err instanceof EntityNotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
});

app.use(router);

startServer(app, PORT, SERVICE_NAME);
