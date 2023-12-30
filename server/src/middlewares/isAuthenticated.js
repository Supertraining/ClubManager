import { routeLogger } from "../utils/logger.js";

export const requireAuthentication = async (req, res, next) => {
           
    try {

        if (req.isAuthenticated()) {

            await next();

        } else {

            await res.status(404).redirect('/login');

        }

    } catch (error) {

        res.status(500).json(

            {
                message: 'Internal server error'
            }

        )

        routeLogger(req, 'error', error);

    }

};

// const tokenHandler = require('../utils/handle.jwt')
// const handleHttp = require('../utils/handle.logs')

// const checkJwt = async (req, res, next) => {
//   try {
//     const bearerJwt = req.headers.authorization
//     const jwtByUser = bearerJwt?.split(' ').pop()
//     const isUser = await tokenHandler.verifyToken(jwtByUser)
//     if (!isUser) return res.status(401).send('NOT AUTHORIZED')
//     req.user = isUser
//     next()
//   } catch (error) {
//     handleHttp.errorHandler(error)
//   }
// }

// module.exports = checkJwt;