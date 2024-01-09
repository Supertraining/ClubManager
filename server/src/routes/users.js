import { Router } from "express";
import UsersController from '../apis/users/controllers/users.js';
import { validate } from "../middlewares/dataValidator.js";

const router = Router();

export default class UserRouter {
    constructor() {
        this.controllers = new UsersController();
    }

    start() {

        router.post(
            '/register',

            validate.user,

         this.controllers.register,
    
        );
        
        router.post(
            '/login',

            this.controllers.login

        );


        router.get(

            '/',

            async (req, res) => {
                
                res.redirect('/home');

            }

        );

        router.get(
            '/home',
            this.controllers
                .getByUserName

        );

        router.get(

            '/getAll',

            this.controllers
                .getAllUsers

        );

        router.get(

            '/user/:id',

            this.controllers
                .getById

        )

        router.delete(

            '/eliminar/:id',

            this.controllers
                .deleteById

        );

        router.put(

            '/reserves/delete',

            this.controllers
                .deleteReserveById

        )

        router.put(

            '/reserves/:username',

            validate.userReservation,

            this.controllers
                .updateUserReserves

        );

        router.put(

            '/update',

            validate.userUpdatePassword,

            this.controllers
                .updateUserPassword

        );

        router.put(

            '/update/:id',

            validate.activityUpdate,

            this.controllers
                .updateUser



        );

        return router
    }
}





