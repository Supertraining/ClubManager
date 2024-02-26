import express from 'express';
import cors from 'cors';
import helmet from "helmet";
import errorHandler from './middlewares/errorHandler.js';
import { Logger } from './utils/logger.js';

export class Server {

  app = express();
  port;
  routes;

  constructor(port, router, corsOptions) {
    this.port = port;
    this.router = router;
    this.corsOptions = corsOptions
  }

  async start() {

    
    this.app.use(helmet());
    this.app.use(cors(this.corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    this.app.use(this.router);

    this.app.use(errorHandler)

    this.app.listen(this.port, () => {
      Logger.level().info(`Server running at port ${this.port}`);
    });
  }
}
