// scripts/snapshot.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outDir = join(__dirname, '..', 'snapshots');
mkdirSync(outDir, { recursive: true });

const VIEWPORTS = [
  { width: 1280, height: 800, suffix: 'desktop' },
  { width: 390, height: 844, suffix: 'mobile' },
];

// We can't really auth without backend, so just capture login + sidebar on first visit.
const PAGES = [
  { path: '/login', name: '01-login' },
  { path: '/failLogin', name: '02-failLogin' },
  { path: '/dashboard', name: '03-dashboard' },
  { path: '/users', name: '04-users' },
  { path: '/courts', name: '05-courts' },
  { path: '/activities', name: '06-activities' },
  { path: '/old-reserves', name: '07-oldreserves' },
  { path: '/events', name: '08-events' },
  { path: '/activities/abc123/edit', name: '09-update-activity' },
];

async function run() {
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();

    // Mock the auth store so we can capture the protected pages.
    await page.addInitScript(() => {
      const fakeUser = {
        state: {
          user: {
            user: { _id: '1', username: 'admin@ranelagh.club', nombre: 'Demo', apellido: 'Admin', admin: true, token: 'mock' },
            loading: false,
            error: null,
          },
        },
        version: 0,
      };
      try { localStorage.setItem('user', JSON.stringify(fakeUser)); } catch {}
      try { sessionStorage.setItem('user', JSON.stringify(fakeUser)); } catch {}
    });

    for (const target of PAGES) {
      const url = `http://localhost:5174${target.path}`;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(600);
        await page.screenshot({
          path: join(outDir, `${target.name}-${vp.suffix}.png`),
          fullPage: false,
        });
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
