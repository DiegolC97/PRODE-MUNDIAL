import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildContainer } from '../../../../../infrastructure/composition-root';
import {
  BusinessRuleViolationError,
  EntityNotFoundError,
} from '../../../../../domain/errors/DomainErrors';

const SubmitSchema = z.object({
  userId: z.string().uuid(),
  matchId: z.string().uuid(),
  predictedHome: z.number().int().min(0).max(99),
  predictedAway: z.number().int().min(0).max(99),
});

export async function POST(request: Request) {
  const { useCases } = buildContainer();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = SubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const result = await useCases.submitPrediction.execute(parsed.data);
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (err) {
    if (err instanceof EntityNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err instanceof BusinessRuleViolationError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
