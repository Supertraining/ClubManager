import { existsSync } from "node:fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const nodeEnv = process.env.NODE_ENV?.trim();
if (nodeEnv === "dev" || nodeEnv === "prod") {
  const envPath = join(__dirname, nodeEnv === "dev" ? ".env.dev" : ".env");
  if (existsSync(envPath)) process.loadEnvFile(envPath);
}

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

if (nodeEnv === "prod" && (!supabaseUrl || !supabaseServiceRoleKey || !supabaseAnonKey)) {
  throw new Error("Production requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and SUPABASE_ANON_KEY.");
}
