import express, { json, urlencoded } from 'express';
import session from 'express-session';
import cors from 'cors';
import * as config from './config/config.js';
import { connect } from './utils/mongoConnection.js';
import passport from 'passport';
import CourtsRouter from './routes/courts.js';
import UserRouter from './routes/users.js';
import logger from './utils/logger.js';
import helmet from "helmet";

const app = express();

app.use(helmet());

app.use(cors({
    origin: [ 'http://localhost:5173', 'http://localhost:5174' ], 
    credentials: true
}));
app.use(session(config.sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.use(json());
app.use(urlencoded({ extended: true }));

const courtsRouter = new CourtsRouter();
const userRouter = new UserRouter();
app.use(userRouter.start());
app.use('/courts', courtsRouter.start());

app.listen(config.port, () => {
    connect(config.mongoUrl)
    logger.info(`Club Manager app listening at http://localhost:${config.port}`);
})

