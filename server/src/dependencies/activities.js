import ActivityDAO from "../apis/activities/DAO/activities.js";
import ActivityControllers from "../apis/activities/controllers/activities.js";
import ActivityServices from "../apis/activities/services/activities.js";
import ActivityRouter from "../routes/activities.js";
import { activityModel } from '../db/models/activity.js'

const activitiesDAO = ActivityDAO.getInstance(activityModel);
const activitiesService = new ActivityServices(activitiesDAO);
const activitiesController = new ActivityControllers(activitiesService);
const activitiesRouter = new ActivityRouter(activitiesController);
const router = activitiesRouter.start();

export default router;

