import EventDAO from "../apis/clubEvents/DAO/events.js";
import EventControllers from "../apis/clubEvents/controllers/events.js";
import EventServices from "../apis/clubEvents/services/events.js";
import { eventModel } from '../db/models/events.js'
import EventRouter from "../routes/events.js";

const eventDAO = EventDAO.getInstance(eventModel);
const eventService = new EventServices(eventDAO);
const eventController = new EventControllers(eventService);
const eventRouter = new EventRouter(eventController);
const router = eventRouter.start();

export default router;
