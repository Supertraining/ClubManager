import cron from 'node-cron';
import { MongoConnection } from './src/db/mongoConnection.js';
import router from './src/dependencies/index.js'
import { Server } from './src/app.js'
import { repeatPermanentReservations } from './src/utils/updatePermanentReservations.Utils.js'
import { admin_dev_url, admin_prod_url, client_dev_url, client_prod_url, mongoUrl } from './src/config/config.js';

(() => {
  main();
})();

async function main() {

  await MongoConnection.connect(mongoUrl);
  const PORT = process.env.PORT || 8080;
  const ROUTER = router;
  const CORS_OPTIONS = {
    origin: [ client_prod_url, admin_prod_url, client_dev_url, admin_dev_url ],
    credentials: true
  };

  new Server(PORT, ROUTER, CORS_OPTIONS).start()

  process.env.TZ = 'America/Argentina/Buenos_Aires';
  cron.schedule('30 15 * * *', repeatPermanentReservations);
}



