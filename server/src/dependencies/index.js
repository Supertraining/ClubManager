import { Router } from 'express';
import fs from 'fs';
import { dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

const cleanFileName = (fileName) => basename(fileName, '.js');

async function dynamicRouter() {
  const dirList = await fs.promises.readdir(__dirname);
  for (const fileName of dirList) {
    const cleanName = cleanFileName(fileName);
    if (cleanName === 'index' || cleanName === 'middlewares') continue;
    const module = await import(`./${cleanName}.js`);
    const subRouter = module.default;
    router.use(`/${cleanName}`, subRouter);
    // eslint-disable-next-line no-console
    console.log(`✓ route loaded: /${cleanName}`);
  }
}

await dynamicRouter();

export default router;
