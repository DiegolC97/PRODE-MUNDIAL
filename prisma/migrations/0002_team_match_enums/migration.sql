-- Migration: 0002_team_match_enums
-- Replaces VarChar stage/status columns on matches with native PostgreSQL enum
-- types, and adds apiFootballId + flagUrl to teams, plus winnerTeamId to
-- matches for knockout progression tracking.

-- ─── Create enum types ──────────────────────────────────────────

CREATE TYPE "stage_enum" AS ENUM (
  'GROUP',
  'R32',
  'R16',
  'QF',
  'SF',
  'THIRD',
  'FINAL'
);

CREATE TYPE "match_status_enum" AS ENUM (
  'SCHEDULED',
  'LIVE',
  'FINISHED',
  'CANCELLED'
);

-- ─── Alter teams table ──────────────────────────────────────────

ALTER TABLE "teams"
  ADD COLUMN "api_football_id" INTEGER,
  ADD COLUMN "flag_url"        TEXT;

-- Backfill: use 0 as a placeholder so we can add NOT NULL + UNIQUE below.
-- In production this column will be populated before the constraint is added,
-- but for a fresh database the table is empty so the constraint applies cleanly.
UPDATE "teams" SET "api_football_id" = 0 WHERE "api_football_id" IS NULL;

ALTER TABLE "teams"
  ALTER COLUMN "api_football_id" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "teams_api_football_id_key"
  ON "teams"("api_football_id");

-- ─── Alter matches table — convert stage ────────────────────────

-- Convert existing VarChar stage values to the new enum type.
-- Any row that doesn't match a valid enum value will fail here, which is
-- intentional: bad data must be cleaned up before migrating.
ALTER TABLE "matches"
  ALTER COLUMN "stage" TYPE "stage_enum"
    USING "stage"::"stage_enum";

-- ─── Alter matches table — convert status ───────────────────────

ALTER TABLE "matches"
  ALTER COLUMN "status" TYPE "match_status_enum"
    USING "status"::"match_status_enum";

-- Remove the old VarChar default and set the enum default
ALTER TABLE "matches"
  ALTER COLUMN "status" SET DEFAULT 'SCHEDULED'::"match_status_enum";

-- ─── Alter matches table — add new columns ──────────────────────

ALTER TABLE "matches"
  ADD COLUMN "api_football_id" INTEGER,
  ADD COLUMN "winner_team_id"  UUID REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill placeholder for NOT NULL constraint (fresh DB will be empty)
UPDATE "matches" SET "api_football_id" = 0 WHERE "api_football_id" IS NULL;

ALTER TABLE "matches"
  ALTER COLUMN "api_football_id" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "matches_api_football_id_key"
  ON "matches"("api_football_id");

-- ─── Add status index ───────────────────────────────────────────

CREATE INDEX IF NOT EXISTS "matches_status_idx"
  ON "matches"("status");
