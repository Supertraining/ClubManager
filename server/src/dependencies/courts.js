import CourtsDAO from "../apis/courts/DAO/courts.js";
import CourtsControllers from "../apis/courts/controllers/courts.js";
import CourtServices from "../apis/courts/services/courts.js";
import { courtModel } from "../db/models/court.js";
import { userModel } from "../db/models/user.js";
import CourtsRouter from "../routes/courts.js";

const courtDAO = CourtsDAO.getInstance(courtModel, userModel);
const courtService = new CourtServices(courtDAO);
const courtController = new CourtsControllers(courtService);
const courtRouter = new CourtsRouter(courtController);
const router = courtRouter.start();

export default router;