import { Router } from 'express';
import fs from 'fs';
import { dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PATH_ROUTER = `${__dirname}`;
const router = Router();

const cleanFileName = (fileName) => {
  const file = basename(fileName, '.js')
  return file;
}

async function dinamycRouter() {
  try {
    const dirList = await fs.promises.readdir(PATH_ROUTER);
    
    dirList.forEach(async (fileName) => {
      const cleanName = cleanFileName(fileName);
      if (cleanName !== 'index' && cleanName !== 'middlewares') {
        const module = await import(`./${cleanName}.js`);
        const routerClass = module.default;
        const moduleRouter = new routerClass();
        router.use(`/${cleanName}`, moduleRouter.start());
        console.log(`Se esta cargando la ruta... /${cleanName}`);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

dinamycRouter();

export default router;