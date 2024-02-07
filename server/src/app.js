import express, { json, urlencoded } from 'express';
import cors from 'cors';
import * as config from './config/config.js';
import { connect } from './db/mongoConnection.js';
// import router from './routes/index.js'
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

connect(config.mongoUrl);

process.env.TZ = 'America/Argentina/Buenos_Aires';
cron.schedule('19 17 * * *', repeatPermanentReservations);

app.use(errorHandler);

export default app;