import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import errorHandler from './middlewares/errorHandler.js';
import { Logger } from './utils/logger.js';

export class Server {

  app = express();
  port;
  routes;
  corsOptions;

  constructor(port, router, corsOptions) {
    this.port = port;
    this.router = router;
    this.corsOptions = corsOptions;
  }

  async start() {

    this.app.use(helmet({
      contentSecurityPolicy: false, // we serve JSON only, no HTML; CSP would be noise
      crossOriginEmbedderPolicy: false,
    }));
    this.app.use(cors(this.corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Healthcheck for load balancers / uptime monitoring.
    this.app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

    this.app.use(this.router);

    this.app.use(errorHandler);

    this.app.listen(this.port, () => {
      Logger.level().info(`Server running at port ${this.port}`);
    });
  }
}
