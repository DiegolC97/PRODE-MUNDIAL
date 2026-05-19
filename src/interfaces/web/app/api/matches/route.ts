import { NextResponse } from 'next/server';
import { buildContainer } from '../../../../../infrastructure/composition-root';

/**
 * Thin HTTP adapter: parse input → call use case → serialize output.
 * Zero business logic.
 */
export async function GET(request: Request) {
  const { useCases } = buildContainer();
  const url = new URL(request.url);
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? Math.max(1, Math.min(100, Number(limitParam))) : undefined;

  try {
    const data = await useCases.listUpcomingMatches.execute({ limit });
    return NextResponse.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
