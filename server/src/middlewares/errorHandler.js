import { errorLogger } from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {

  try {
    
    const errorStatus = err.statusCode || 500;
    const errorMessage = err.message || 'Internal server error';

    const additionalInfo = {
      route: req.originalUrl,
      method: req.method,
      ip: req.ip,
      user_agent: req.header[ 'user-agent' ],
      user: req.user
    };
    errorLogger(err, additionalInfo);
    res.status(errorStatus).send(errorMessage);
    
  } catch (error) {

    errorLogger(error)
    
  }
};

export default errorHandler;