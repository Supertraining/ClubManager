import UsersDAO from "../apis/users/DAO/users.js";
import UsersController from "../apis/users/controllers/users.js";
import UsersServices from "../apis/users/services/users.js";
import UserRouter from "../routes/users.js";
import { userModel } from "../db/models/user.js";
import UsersRepository from "../apis/users/repository/users.js";


const userDAO = UsersDAO.getInstance(userModel);
const userRepository = new UsersRepository(userDAO);
const userServices = new UsersServices(userRepository);
const usersController = new UsersController(userServices);
const userRouter = new UserRouter(usersController);
const router = userRouter.start();

export default router;