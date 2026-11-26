import { Router } from 'express';
import { IsAuthenticated } from '../middlewares/isAuthenticated.js';
import { IsAdmin } from '../middlewares/isAdmin.js';
import { requireMembership } from '../middlewares/clubContext.js';
import { getClub, updateSettings, join, invite } from '../modules/clubs/controllers/clubs.js';

const router = Router();
router.get('/', getClub);
router.post('/memberships/join', IsAuthenticated.checkJwt, join);
router.post('/memberships/invitations', IsAuthenticated.checkJwt, requireMembership, IsAdmin.requireAdmin, invite);
router.put('/settings', IsAuthenticated.checkJwt, requireMembership, IsAdmin.requireAdmin, updateSettings);

export default router;
