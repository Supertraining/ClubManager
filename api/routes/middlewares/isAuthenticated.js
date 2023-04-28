import { routeLogger } from "../../utils/logger.js";

export const requireAuthentication = async (req, res, next) => {
        console.log(req.isAuthenticated())
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