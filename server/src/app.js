import express, { json, urlencoded } from 'express';
import cors from 'cors';
import * as config from './config/config.js';
import { MongoConnection } from './db/mongoConnection.js';
import router from './dependencies/index.js'
import helmet from "helmet";
import cron from 'node-cron';
import { repeatPermanentReservations } from './utils/updatePermanentReservations.Utils.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());

app.use(cors({
  origin: [ config.client_prod_url, config.admin_prod_url, config.client_dev_url, config.admin_dev_url ],
  credentials: true
}));

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(router);


MongoConnection.connect(config.mongoUrl)

process.env.TZ = 'America/Argentina/Buenos_Aires';
cron.schedule('19 17 * * *', repeatPermanentReservations);

app.use(errorHandler);

export default app;

// (() => {
//   main();
// })();

// async function main() {
  
//   await MongoDatabase.connect({
//     dbName: envs.MONGO_DB_NAME,
//     mongoUrl: envs.MONGO_URL,
//   })

//   new Server({
//     port: envs.PORT,
//     routes: AppRoutes.routes
//   }).start()
// }


// export class Server {
//   public readonly app = express();
//   private readonly port: number;
//   private readonly routes: Router;

//   constructor(options: Options) {
//     const { port = 3100, routes } = options;

//     this.port = port;
//     this.routes = routes;
//   }

//   async start() {
//     //middlewares
//     this.app.use(express.json());
//     this.app.use(express.urlencoded({ extended: true }));

//     //usar las rutas definidas
//     this.app.use(this.routes);

//     this.app.use(ErrorHandler.errorHandler)

//     this.app.listen(this.port, () => {
//       console.log(`Server running at port ${this.port}`);
//     });
//   }
// }
