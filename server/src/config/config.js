import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Logger } from "../utils/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const nodeEnv = process.env.NODE_ENV?.trim();
nodeEnv === "dev"
  ? process.loadEnvFile(join(__dirname, ".env.dev"))
  : nodeEnv === "prod" ? process.loadEnvFile(join(__dirname, ".env")) : Logger.level().info("Production environment");

export const {
  // CORS — frontend URLs
  CLIENT_PROD_URL: client_prod_url,
  ADMIN_PROD_URL: admin_prod_url,
  CLIENT_DEV_URL: client_dev_url,
  ADMIN_DEV_URL: admin_dev_url,

  // Supabase — required
  SUPABASE_URL: supabaseUrl,
  SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey,
  SUPABASE_ANON_KEY: supabaseAnonKey,

  // Gmail — optional (used for new-user + password-change notifications)
  SERVICE: gmailService,
  GMAILPORT: gmailPort,
  GMAILUSER: gmailUser,
  GMAILPASS: gmailPass,
} = process.env;

export const port = process.env.PORT || 8080;

/**
 * Guard: in prod, Supabase credentials are mandatory. In dev, log a warning
 * and let the dev set them up. See server/src/config/.env.example.
 */
if (nodeEnv === "prod") {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in production. " +
      "See server/src/config/.env.example."
    );
  }
}
