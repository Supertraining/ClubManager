import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import errorHandler from './middlewares/errorHandler.js';
import { Logger } from './utils/logger.js';

export function createApp({ router, corsOptions }) {
  const app = express();
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));
  app.use(router);
  app.use(errorHandler);
  return app;
}

export class Server {
  constructor(port, router, corsOptions) {
    this.port = port;
    this.app = createApp({ router, corsOptions });
  }

  async start() {
    this.app.listen(this.port, () => {
      Logger.level().info(`Server running at port ${this.port}`);
    });
  }
}
