-- Migration: 0001_add_user_profile
-- Adds username and password_hash columns to users table, and creates profiles table.

-- ─── Alter users table ──────────────────────────────────────────
ALTER TABLE "users"
  ADD COLUMN "username"      VARCHAR(40)  NOT NULL DEFAULT '',
  ADD COLUMN "password_hash" VARCHAR(255) NOT NULL DEFAULT '';

-- Remove the temporary defaults (columns are now NOT NULL and populated)
ALTER TABLE "users"
  ALTER COLUMN "username"      DROP DEFAULT,
  ALTER COLUMN "password_hash" DROP DEFAULT;

-- Unique index on username
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username");

-- ─── Create profiles table ──────────────────────────────────────
CREATE TABLE "profiles" (
  "id"          UUID         NOT NULL DEFAULT gen_random_uuid(),
  "user_id"     UUID         NOT NULL,
  "name"        VARCHAR(80)  NOT NULL,
  "country"     CHAR(2)      NOT NULL,
  "avatar_url"  TEXT,
  "total_score" INTEGER      NOT NULL DEFAULT 0,

  CONSTRAINT "profiles_pkey"    PRIMARY KEY ("id"),
  CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Unique constraint for 1:1 relation
CREATE UNIQUE INDEX IF NOT EXISTS "profiles_user_id_key" ON "profiles"("user_id");

-- Index on total_score for leaderboard queries
CREATE INDEX IF NOT EXISTS "profiles_total_score_idx" ON "profiles"("total_score");
