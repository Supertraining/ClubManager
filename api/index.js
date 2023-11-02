import express, { json, urlencoded } from 'express';
import cors from 'cors';
import * as config from './src/config/config.js';
import { connect } from './src/utils/mongoConnection.js';
import router from './src/routes/index.js'
import logger from './src/utils/logger.js';
import helmet from "helmet";
import cron from 'node-cron';
import { repeatPermanentReservations } from './src/utils/updatePermanentReservations.js';

const app = express();

app.use(helmet());

app.use(cors({
  origin: [ config.client_prod_url, config.admin_prod_url, config.client_dev_url, config.admin_dev_url ],
  credentials: true
}));

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(router)

process.env.TZ = 'America/Argentina/Buenos_Aires';
cron.schedule('19 17 * * *', repeatPermanentReservations);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  connect(config.mongoUrl)
  logger.info(`Club Manager app listening at ${PORT}`);

})

