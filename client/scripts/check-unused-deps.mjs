// scripts/check-unused-deps.mjs
// One-off: find dependencies declared in package.json that are not
// imported anywhere in src/. Useful when cleaning up after a redesign.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const runtimeDeps = pkg.dependencies || {};

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.')) continue;
      yield* walk(p);
    } else if (/\.(js|jsx|ts|tsx)$/.test(entry)) {
      yield p;
    }
  }
}

// Collect all "from 'X'" and "from 'X/...'" and "require('X')" tokens.
const importRe = /(?:from\s+|require\s*\(\s*)['"]([^'"./][^'"]*)['"]/g;

const used = new Set();
for (const file of walk(join(root, 'src'))) {
  const content = readFileSync(file, 'utf8');
  let m;
  while ((m = importRe.exec(content))) {
    // Take the first segment of the import path — that's the package name.
    const pkgName = m[1].startsWith('@')
      ? m[1].split('/').slice(0, 2).join('/')
      : m[1].split('/')[0];
    used.add(pkgName);
  }
}

console.log('UNUSED runtime dependencies:');
let count = 0;
for (const dep of Object.keys(runtimeDeps)) {
  if (!used.has(dep)) {
    console.log('  -', dep);
    count++;
  }
}
console.log(`Total unused: ${count} of ${Object.keys(runtimeDeps).length}`);
