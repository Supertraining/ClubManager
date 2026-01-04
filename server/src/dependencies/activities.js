import ActivityControllers from "../modules/activities/controllers/activities.js";
import ActivityServices from "../modules/activities/services/activities.js";
import ActivityRouter from "../routes/activities.js";
import { activityModel } from "../db/models/activity.js";
import ActivityRepository from "../modules/activities/repository/activities.js";
import MongoDao from "../core/dao/mongoDb.dao.js";

const activitiesDAO = new MongoDao(activityModel);
const activitiesRepository = ActivityRepository.getInstance(activitiesDAO);
const activitiesService = new ActivityServices(activitiesRepository);
const activitiesController = new ActivityControllers(activitiesService);
const activitiesRouter = new ActivityRouter(activitiesController);
const router = activitiesRouter.start();

export default router;
