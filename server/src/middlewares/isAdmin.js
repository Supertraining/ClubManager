import { CustomError } from '../utils/customError.Utils.js';

/**
 * isAdmin — must be chained AFTER `IsAuthenticated.checkJwt`.
 * Reads `req.user.isAdmin` (set by the auth middleware via `verifyAccessToken`).
 */
export const IsAdmin = {
  requireAdmin: (req, _res, next) => {
    if (!req.user?.isAdmin) {
      return next(CustomError.forbidden('Admin role required'));
    }
    next();
  },
};
