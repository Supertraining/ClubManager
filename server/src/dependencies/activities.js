import ActivitiesDAO from '../modules/activities/DAO/activities.js';
import ActivityControllers from '../modules/activities/controllers/activities.js';
import ActivityServices from '../modules/activities/services/activities.js';
import ActivityRouter from '../routes/activities.js';

const activitiesDAO = ActivitiesDAO.getInstance();
const activitiesService = new ActivityServices(activitiesDAO);
const activitiesController = new ActivityControllers(activitiesService);
const activitiesRouter = new ActivityRouter(activitiesController);
const router = activitiesRouter.start();

export default router;
