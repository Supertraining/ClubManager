import { findClub, findMembership } from '../modules/clubs/DAO/clubs.js';
import { CustomError } from '../utils/customError.Utils.js';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function loadClub(selectSlug) {
  return async (req, _res, next) => {
    try {
      const slug = selectSlug(req);
      if (!slug || slug.length > 63 || !slugPattern.test(slug)) {
        throw CustomError.notFound('Club no encontrado.');
      }
      const club = await findClub(slug);
      if (!club) throw CustomError.notFound('Club no encontrado.');
      req.club = club;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export const resolveClub = loadClub(req => req.params.clubSlug);
export const resolveRanelagh = loadClub(() => 'ranelagh');

export async function requireMembership(req, _res, next) {
  try {
    const membership = await findMembership(req.club.id, req.user.id, req.accessToken);
    if (!membership) throw CustomError.forbidden('Sumate al club para acceder con esta cuenta.');
    req.membership = membership;
    next();
  } catch (error) {
    next(error);
  }
}
