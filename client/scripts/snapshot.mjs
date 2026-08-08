// scripts/snapshot.mjs
// Take screenshots of the running dev server for visual review.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outDir = join(__dirname, '..', 'snapshots');
mkdirSync(outDir, { recursive: true });

const PAGES = [
  { path: '/', name: '01-home', scroll: [0, 800, 1600, 2400, 3200] },
  { path: '/reserves', name: '02-reserves', state: { court: 'futbol' } },
  { path: '/login', name: '03-login' },
  { path: '/register', name: '04-register' },
  { path: '/notfound-test', name: '05-notfound' },
];

const VIEWPORTS = [
  { width: 1280, height: 800, suffix: 'desktop' },
  { width: 390, height: 844, suffix: 'mobile' },
];

async function run() {
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();

    for (const target of PAGES) {
      const url = `http://localhost:5173${target.path}`;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
        // wait for fonts
        await page.waitForTimeout(800);

        if (target.scroll) {
          for (let i = 0; i < target.scroll.length; i++) {
            await page.evaluate((y) => window.scrollTo(0, y), target.scroll[i]);
            await page.waitForTimeout(400);
            await page.screenshot({
              path: join(outDir, `${target.name}-${vp.suffix}-${i}.png`),
              fullPage: false,
            });
          }
        } else {
          await page.screenshot({
            path: join(outDir, `${target.name}-${vp.suffix}.png`),
            fullPage: true,
          });
        }
        console.log(`OK: ${target.name} (${vp.suffix})`);
      } catch (err) {
        console.error(`FAIL: ${target.name} (${vp.suffix}) -> ${err.message}`);
      }
    }

    await ctx.close();
  }
  await browser.close();
}

run();
