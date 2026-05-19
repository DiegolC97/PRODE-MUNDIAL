import { buildContainer } from '../../../../infrastructure/composition-root';

export const dynamic = 'force-dynamic';

export default async function MatchesPage() {
  const { useCases } = buildContainer();

  let matches: Awaited<ReturnType<typeof useCases.listUpcomingMatches.execute>> = [];
  let error: string | null = null;
  try {
    matches = await useCases.listUpcomingMatches.execute({ limit: 20 });
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <section>
      <h2>Upcoming matches</h2>
      {error && (
        <p style={{ color: '#ff8080' }}>
          Could not load matches: {error}
          <br />
          <small>(Did you run <code>docker compose up</code> and the migrations?)</small>
        </p>
      )}
      {!error && matches.length === 0 && <p>No upcoming matches scheduled.</p>}
      <ul>
        {matches.map((m) => (
          <li key={m.id}>
            <strong>{m.stage}</strong> — {m.homeTeamId} vs {m.awayTeamId} —{' '}
            {new Date(m.kickoffAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </section>
  );
}
