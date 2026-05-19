#!/usr/bin/env node
/**
 * Tiny migration runner.
 * Reads scripts/init.sql and executes it against DATABASE_URL.
 * For real projects, swap this for a proper migrator (Flyway, node-pg-migrate, etc.).
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

require('dotenv').config();

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(sql);
    console.info('[migrate] init.sql applied successfully');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('[migrate] failed', err);
  process.exit(1);
});
