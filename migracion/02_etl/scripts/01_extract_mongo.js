// 01_extract_mongo.js
// Lee todas las colecciones de MongoDB y vuelca a dump.json
import { MongoClient } from 'mongodb';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error('MONGO_URL is required. Set it in 02_etl/.env or as an env var.');
  process.exit(1);
}

const COLLECTIONS = ['users', 'courts', 'activities', 'events'];

async function main() {
  console.log('[extract] Connecting to MongoDB...');
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log('[extract] Connected.');

  const db = client.db();
  const dump = {};

  for (const name of COLLECTIONS) {
    console.log(`[extract] Reading ${name}...`);
    const docs = await db.collection(name).find({}).toArray();
    dump[name] = docs;
    console.log(`[extract]   ${name}: ${docs.length} docs`);
  }

  await client.close();

  const outPath = join(__dirname, '..', 'dump.json');
  writeFileSync(outPath, JSON.stringify(dump, null, 2), 'utf8');
  console.log(`[extract] Wrote ${outPath}`);

  const total = Object.values(dump).reduce((a, b) => a + b.length, 0);
  console.log(`[extract] Total documents: ${total}`);
}

main().catch((err) => {
  console.error('[extract] FAILED:', err);
  process.exit(1);
});
