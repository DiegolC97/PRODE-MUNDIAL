import { readFileSync } from 'fs';
import { join } from 'path';

const repoRoot = join(__dirname, '..', '..');
const compose = readFileSync(join(repoRoot, 'docker-compose.yml'), 'utf8');
const envExample = readFileSync(join(repoRoot, '.env.example'), 'utf8');
const readme = readFileSync(join(repoRoot, 'README.md'), 'utf8');

const serviceBlock = (yaml: string, name: string): string => {
  const start = yaml.indexOf(`\n  ${name}:`);
  if (start === -1) throw new Error(`service '${name}' not found in docker-compose.yml`);
  const rest = yaml.slice(start + 1);
  const next = rest.search(/\n[A-Za-z_-]+:|\n {2}[A-Za-z_-]+:\n/);
  return next === -1 ? rest : rest.slice(0, next);
};

describe('docker compose up starts Postgres and Redis with healthchecks', () => {
  it('declares a postgres service on the postgres:16 image with a healthcheck', () => {
    const postgres = serviceBlock(compose, 'postgres');
    expect(postgres).toMatch(/image:\s*postgres:16/);
    expect(postgres).toMatch(/healthcheck:/);
    expect(postgres).toMatch(/pg_isready/);
  });

  it('declares a redis service on the redis:7 image with a healthcheck', () => {
    const redis = serviceBlock(compose, 'redis');
    expect(redis).toMatch(/image:\s*redis:7/);
    expect(redis).toMatch(/healthcheck:/);
    expect(redis).toMatch(/redis-cli/);
    expect(redis).toMatch(/ping/);
  });
});

describe('Volumes persist data across container restarts', () => {
  it('declares named volumes for postgres and redis at the top level', () => {
    const volumesSection = compose.slice(compose.lastIndexOf('\nvolumes:'));
    expect(volumesSection).toMatch(/\n {2}postgres-data:/);
    expect(volumesSection).toMatch(/\n {2}redis-data:/);
  });

  it('mounts the postgres named volume at /var/lib/postgresql/data', () => {
    const postgres = serviceBlock(compose, 'postgres');
    expect(postgres).toMatch(/postgres-data:\/var\/lib\/postgresql\/data/);
  });

  it('mounts the redis named volume at /data', () => {
    const redis = serviceBlock(compose, 'redis');
    expect(redis).toMatch(/redis-data:\/data/);
  });
});

describe('.env.example documents every required variable', () => {
  const required = [
    'DATABASE_URL',
    'REDIS_URL',
    'NEXTAUTH_SECRET',
    'API_FOOTBALL_KEY',
  ];

  it.each(required)('contains %s', (name) => {
    const re = new RegExp(`^${name}=`, 'm');
    expect(envExample).toMatch(re);
  });
});

describe("README has 'Local setup' section", () => {
  it('contains a Markdown heading titled "Local setup"', () => {
    expect(readme).toMatch(/^#{1,6}\s+Local setup\s*$/m);
  });
});
