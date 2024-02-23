import cron from 'node-cron';
import * as config from './src/config/config.js';
import { MongoConnection } from './src/db/mongoConnection.js';
import router from './src/dependencies/index.js'
import { Server } from './src/app.js'
import { repeatPermanentReservations } from './src/utils/updatePermanentReservations.Utils.js'

(() => {
  main();
})();

async function main() {

  await MongoConnection.connect(config.mongoUrl);

  const PORT = process.env.PORT || 8080;
  const ROUTER = router;
  const CORS_OPTIONS = {
    origin: [ config.client_prod_url, config.admin_prod_url, config.client_dev_url, config.admin_dev_url ],
    credentials: true
  };

  new Server(PORT, ROUTER, CORS_OPTIONS).start()

  process.env.TZ = 'America/Argentina/Buenos_Aires';
  cron.schedule('30 15 * * *', repeatPermanentReservations);
}



