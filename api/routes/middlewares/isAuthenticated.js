import { routeLogger } from "../../utils/logger.js";

export const requireAuthentication = async (req, res, next) => {

    try {

        console.log('REQUIRE AUTH', req.isAuthenticated());
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