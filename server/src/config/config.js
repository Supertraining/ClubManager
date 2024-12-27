import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Logger } from "../utils/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const nodeEnv = process.env.NODE_ENV?.trim();
nodeEnv === "dev"
  ? process.loadEnvFile(join(__dirname, ".env.dev"))
  : nodeEnv === "prod" ? process.loadEnvFile(join(__dirname, ".env")) : Logger.level().info("Production environment");

export const {
  MONGO_URL: mongoUrl,
  CLIENT_PROD_URL: client_prod_url,
  ADMIN_PROD_URL: admin_prod_url,
  CLIENT_DEV_URL: client_dev_url,
  ADMIN_DEV_URL: admin_dev_url,
  JWT_SECRET: JWT_SEED,
  SERVICE: gmailService,
  GMAILPORT: gmailPort,
  GMAILUSER: gmailUser,
  GMAILPASS: gmailPass,
} = process.env;

export const port = process.env.PORT || 8080;
