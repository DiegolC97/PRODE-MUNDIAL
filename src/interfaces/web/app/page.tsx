import Link from 'next/link';

export default function HomePage() {
  return (
    <section>
      <h2>Welcome to the prediction pool</h2>
      <p>
        Place your bets on every World Cup match. Earn points for correct outcomes,
        bonus points for the exact score.
      </p>
      <ul>
        <li>
          <Link href="/matches">Browse upcoming matches</Link>
        </li>
        <li>
          <a href="/api/health">API health check</a>
        </li>
      </ul>
      <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />
      <h3>Architecture</h3>
      <p>
        This frontend is the BFF (Backend-For-Frontend) of three independent
        microservices: <code>matches-service</code>, <code>predictions-service</code>,{' '}
        <code>scoring-service</code>. See <code>README.md</code>.
      </p>
    </section>
  );
}
