/**
 * predictions-service
 *
 * Owns user predictions. Exposes:
 *   POST /predictions   { userId, matchId, predictedHome, predictedAway }
 */
import 'dotenv/config';
import express from 'express';
import { z } from 'zod';
import { buildContainer } from '../../../infrastructure/composition-root';
import { env } from '../../../infrastructure/config/env';
import {
  BusinessRuleViolationError,
  EntityNotFoundError,
} from '../../../domain/errors/DomainErrors';
import { createServer, startServer } from '../shared/createServer';

const SERVICE_NAME = 'predictions-service';
const PORT = Number(process.env.SERVICE_PORT ?? env.servicePort ?? 4002);

const app = createServer(SERVICE_NAME);
const { useCases } = buildContainer();

const SubmitSchema = z.object({
  userId: z.string().uuid(),
  matchId: z.string().uuid(),
  predictedHome: z.number().int().min(0).max(99),
  predictedAway: z.number().int().min(0).max(99),
});

const router = express.Router();

router.post('/predictions', async (req, res, next) => {
  const parsed = SubmitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }

  try {
    const data = await useCases.submitPrediction.execute(parsed.data);
    res.status(201).json({ data });
  } catch (err) {
    if (err instanceof EntityNotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    if (err instanceof BusinessRuleViolationError) {
      res.status(409).json({ error: err.message });
      return;
    }
    next(err);
  }
});

app.use(router);

startServer(app, PORT, SERVICE_NAME);
