
const envFile = process.env.NODE_ENV?.trim() !== "development" ? ".env" : ".env.dev";

process.loadEnvFile(`./${envFile}`);
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
