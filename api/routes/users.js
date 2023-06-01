import { Router } from "express";
import passport from 'passport';
import UsersController from '../controllers/users.js';
import { passportRegister, passportLogin } from './middlewares/passport.js';
import { requireAuthentication } from './middlewares/isAuthenticated.js';

const router = Router();

export default class UserRouter {
    constructor() {
        this.controllers = new UsersController();
    }

    start() {

        router.post(
            '/register',

            passportRegister,

            passport.authenticate('register',
                {
                    failureRedirect: '/failregister',
                    successRedirect: '/'
                }
            )
        );

        router.get(
            '/failregister',

            this.controllers
                .failRegister

        )

        router.get(

            '/login',

            async (req, res) => {

                try {

                    req.isAuthenticated()

                        ? res.json(true)
                        : res.json(false)

                } catch (error) {

                    routeLogger(req, 'error', error);

                }


            }

        );

        router.post(
            '/login',

            passportLogin,


            passport
                .authenticate('login',

                    {
                        failureRedirect: '/faillogin',
                        successRedirect: '/home'
                    }
                )

        );

        router.get(
            '/faillogin',


            this.controllers
                .failLogin

        );

        router.post(

            '/logout',

            this.controllers
                .logout

        );

        router.get(

            '/',

            async (req, res) => {

                res.redirect('/home');

            }

        );

        router.get(

            '/home',

            requireAuthentication,

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

            this.controllers
                .updateUserReserves

        );
        router.put(

            '/update/:id',

            this.controllers
                .updateUser

        );

        return router
    }
}





