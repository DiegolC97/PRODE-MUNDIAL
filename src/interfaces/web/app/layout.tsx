import type { ReactNode } from 'react';

export const metadata = {
  title: 'PRODE MUNDIAL',
  description: 'World Cup prediction pool',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          margin: 0,
          padding: 0,
          background: '#0b1020',
          color: '#f5f7ff',
          minHeight: '100vh',
        }}
      >
        <header
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '0.05em' }}>
            ⚽ PRODE MUNDIAL
          </h1>
        </header>
        <main style={{ padding: '2rem' }}>{children}</main>
      </body>
    </html>
  );
}
