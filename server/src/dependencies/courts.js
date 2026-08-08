import CourtsDAO from '../modules/courts/DAO/courts.js';
import CourtsControllers from '../modules/courts/controllers/courts.js';
import CourtServices from '../modules/courts/services/courts.js';
import CourtsRouter from '../routes/courts.js';

const courtDAO = CourtsDAO.getInstance();
const courtService = new CourtServices(courtDAO);
const courtController = new CourtsControllers(courtService);
const courtRouter = new CourtsRouter(courtController);
const router = courtRouter.start();

export default router;
