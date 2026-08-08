// scripts/optimize-images.mjs
// Step 1: generate optimized copies as `.opt.tmp` next to originals.
// Step 2: use PowerShell (run separately) to move the .opt.tmp files
//         over the originals — Windows file handles held by antivirus
//         or indexer block Node's unlink but allow the OS-level move.

import sharp from 'sharp';
import { statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetsRoot = join(__dirname, '..', 'src', 'assets');

const TARGETS = [
  ['football/footballCourt.webp', 1600, 78],
  ['paddle/paddle-min.webp', 1600, 78],
  ['squash/squash-min.webp', 1600, 78],
  ['home/functional.webp', 1600, 78],
  ['home/child-football-1.webp', 1200, 78],
  ['home/child-gymnastics-1.webp', 1200, 78],
  ['home/child-roller-skates.webp', 1200, 78],
  ['paleta/CanchaPaleta.webp', 1200, 78],
  ['paleta/paleta.webp', 1200, 78],
];

async function optimize() {
  for (const [rel, width, quality] of TARGETS) {
    const src = join(assetsRoot, rel);
    const tmp = src + '.opt.tmp';
    try {
      if (!existsSync(src)) {
        console.error(`MISS: ${rel}`);
        continue;
      }
      const meta = await sharp(src).metadata();
      const before = statSync(src).size;

      await sharp(src)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 4 })
        .toFile(tmp);

      const after = statSync(tmp).size;
      const savings = (((before - after) / before) * 100).toFixed(1);
      console.log(
        `${rel.padEnd(40)} ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (-${savings}%) [${meta.width}x${meta.height}]`,
      );
    } catch (err) {
      console.error(`FAIL: ${rel} -> ${err.message}`);
    }
  }
}

optimize();
