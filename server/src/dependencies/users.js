import UsersDAO from '../modules/users/DAO/users.js';
import UsersController from '../modules/users/controllers/users.js';
import UsersServices from '../modules/users/services/users.js';
import UserRouter from '../routes/users.js';

const userDAO = UsersDAO.getInstance();
const userServices = new UsersServices(userDAO);
const usersController = new UsersController(userServices);
const userRouter = new UserRouter(usersController);
const router = userRouter.start();

export default router;
