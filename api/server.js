import express, { json, urlencoded } from 'express';
import session from 'express-session';
import cors from 'cors';
import * as config from './config/config.js';
import { connect } from './utils/mongoConnection.js';
import passport from 'passport';
import CourtsRouter from './routes/courts.js';
import UserRouter from './routes/users.js';
import EventRouter from './routes/events.js';
import logger from './utils/logger.js';
import helmet from "helmet";
import cron from 'node-cron';
import { repeatPermanentReservations } from './utils/updatePermanentReservations.js';

const app = express();

app.use(helmet());


app.use(cors({
  origin: [ 'https://club-manager-client.netlify.app', 'http://localhost:5173', 'http://localhost:5174' ],
  credentials: true
}));

app.use(session(config.sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.use(json());
app.use(urlencoded({ extended: true }));

const courtsRouter = new CourtsRouter();
const userRouter = new UserRouter();
const eventsRouter = new EventRouter();
app.use(userRouter.start());
app.use('/courts', courtsRouter.start());
app.use('/events', eventsRouter.start());

process.env.TZ = 'America/Argentina/Buenos_Aires';
cron.schedule('01 00 * * *', repeatPermanentReservations);
const PORT = process.argv[ 2 ] || config.port;

app.listen(PORT, () => {
  connect(config.mongoUrl)
  logger.info(`Club Manager app listening at ${PORT}`);
})

