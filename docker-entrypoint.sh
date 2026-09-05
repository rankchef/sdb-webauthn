#!/bin/sh
set -e

echo "Waiting for database..."
node --input-type=module <<'EOF'
import pg from 'pg';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const url = process.env.DATABASE_URL;

if (!url) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

for (let attempt = 1; attempt <= 30; attempt += 1) {
  const client = new pg.Client({ connectionString: url });
  try {
    await client.connect();
    await client.end();
    process.exit(0);
  } catch (err) {
    await client.end().catch(() => {});
    console.log(`Database not ready (${attempt}/30): ${err.message}`);
    await delay(1000);
  }
}

console.error('Timed out waiting for the database');
process.exit(1);
EOF

echo "Running migrations..."
npm run migrate:up

echo "Starting server..."
exec node index.js
