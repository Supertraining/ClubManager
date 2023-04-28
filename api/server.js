import express, { json, urlencoded } from 'express';
import session from 'express-session';
import cors from 'cors';
import * as config from './config/config.js';
import { connect } from './utils/mongoConnection.js';
import passport from 'passport';
import CourtsRouter from './routes/courts.js';
import UserRouter from './routes/users.js';
const app = express();

app.use(session(config.sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));


//!este middleware es un error handler, en cada catch en lugar
//!de escribir console.log(err) por ejemplo, vamos a poner next(err)
//!Tambien cree en utils una funcion createError que tengo que ver como la usa en el video
app.use((err, req, res, next) => { 
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'Something went wrong';
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
});

const courtsRouter = new CourtsRouter();
const userRouter = new UserRouter();
app.use(userRouter.start());
app.use('/courts', courtsRouter.start());


app.listen(config.port, () => {
    connect(config.mongoUrl)
    console.log(`Example app listening at http://localhost:${config.port}`);
})

