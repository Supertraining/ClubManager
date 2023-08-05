import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';

dotenv.config({ path: './config/.env' });

export const port = process.env.PORT || 8080;
export const mongoUrl = process.env.MONGO_URL;


const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
export const sessionConfig = {

  store: MongoStore.create(
    {
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: advancedOptions,
      collectionName: 'sessions',
      ttl: 600,
    }
  ),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
};

export const gmailData = {
  gmailService: process.env.SERVICE,
  gmailPort: process.env.GMAILPORT,
  gmailUser: process.env.GMAILUSER,
  gmailPass: process.env.GMAILPASS,
}



