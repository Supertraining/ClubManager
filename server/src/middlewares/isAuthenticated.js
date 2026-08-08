import { CustomError } from '../utils/customError.Utils.js';
import { verifyAccessToken } from '../config/supabaseClient.js';

/**
 * isAuthenticated — verifies the Supabase access token from the
 * `Authorization: Bearer <jwt>` header and attaches the user profile to `req.user`.
 *
 * `verifyAccessToken` returns the union of `auth.users` and the `profiles` row,
 * plus an `isAdmin` boolean derived from `profiles.role`.
 *
 * For per-user DB operations the handler should call
 * `createUserClient(req.user.accessToken)` so RLS policies kick in.
 */
export const IsAuthenticated = {
  checkJwt: async (req, res, next) => {
    try {
      const bearerJwt = req.headers.authorization;
      const token = bearerJwt?.split(' ').pop();
      const user = await verifyAccessToken(token);
      if (!user) throw CustomError.unauthorized('NOT AUTHORIZED');
      req.user = user;
      // Keep the raw token around so handlers can build a per-user Supabase client.
      req.accessToken = token;
      next();
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
        return;
      }
      next(CustomError.internalError());
    }
  },
};
