import { CustomError } from '../utils/customError.Utils.js';

/**
 * isAdmin — must be chained AFTER `IsAuthenticated.checkJwt`.
 * Uses the current membership for the club resolved from this request.
 */
export const IsAdmin = {
  requireAdmin: (req, _res, next) => {
    if (req.membership?.role !== 'admin') {
      return next(CustomError.forbidden('Necesitás permisos de administrador.'));
    }
    next();
  },
};
