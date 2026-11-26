import { Router } from 'express';
import users from './users.js';
import courts from './courts.js';
import activities from './activities.js';
import events from './events.js';
import billing from './billing.js';
import clubs from '../routes/clubs.js';
import { resolveClub, resolveRanelagh } from '../middlewares/clubContext.js';

const router = Router();
router.use('/billing', billing);
router.use('/clubs/:clubSlug', resolveClub, clubs);
const clubOperations = Router();

for (const [name, controller] of Object.entries({ users, courts, activities, events })) {
  clubOperations.use('/' + name, controller);
  router.use('/' + name, resolveRanelagh, controller);
}

router.use('/clubs/:clubSlug', clubOperations);
export default router;
