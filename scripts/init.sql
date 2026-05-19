-- PRODE MUNDIAL — Initial database schema
-- This script runs automatically on first Postgres container start.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Teams ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teams (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL UNIQUE,
  country_code CHAR(3) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Matches ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS matches (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  home_team_id  UUID NOT NULL REFERENCES teams(id),
  away_team_id  UUID NOT NULL REFERENCES teams(id),
  kickoff_at    TIMESTAMPTZ NOT NULL,
  stage         VARCHAR(40) NOT NULL,
  home_score    INTEGER,
  away_score    INTEGER,
  status        VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (home_team_id <> away_team_id)
);
CREATE INDEX IF NOT EXISTS matches_kickoff_idx ON matches (kickoff_at);

-- ─── Users ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      VARCHAR(200) NOT NULL UNIQUE,
  display_name VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Predictions ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS predictions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id),
  match_id        UUID NOT NULL REFERENCES matches(id),
  predicted_home  INTEGER NOT NULL CHECK (predicted_home >= 0),
  predicted_away  INTEGER NOT NULL CHECK (predicted_away >= 0),
  points_awarded  INTEGER,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, match_id)
);
CREATE INDEX IF NOT EXISTS predictions_user_idx ON predictions (user_id);
