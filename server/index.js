import router from './src/dependencies/index.js';
import { Server } from './src/app.js';
import { admin_dev_url, admin_prod_url, client_dev_url, client_prod_url, port } from './src/config/config.js';

async function main() {

  const CORS_OPTIONS = {
    origin: [client_prod_url, admin_prod_url, client_dev_url, admin_dev_url],
    credentials: true,
  };

  process.env.TZ = 'America/Argentina/Buenos_Aires';

  new Server(port, router, CORS_OPTIONS).start();
}

main().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
