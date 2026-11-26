import { Router } from "express";
import { IsAuthenticated } from "../middlewares/isAuthenticated.js";
import { IsAdmin } from "../middlewares/isAdmin.js";
import { requireMembership } from '../middlewares/clubContext.js';

const router = Router();

export default class CourtsRouter {
    constructor(courtsControllers) {
        this.controllers = courtsControllers;
    }

    start() {

        router.get(

            "/",

            this.controllers
                .getAll

        )

        router.get('/:name/availability', (req, res, next) => {
            if (!req.headers.authorization) return next();
            return IsAuthenticated.checkJwt(req, res, next);
        }, this.controllers.availability);

        router.use(IsAuthenticated.checkJwt, requireMembership);

        router.get(

            "/:name",

            this.controllers
                .getUnavailableDatesByName

        )

        router.post(

            "/createCourt",
            IsAdmin.requireAdmin,

            this.controllers
                .save

        )

        router.delete(

            "/delete/:id",
            IsAdmin.requireAdmin,

            this.controllers
                .deleteCourtById

        )

        router.put(

            "/reserve",

            this.controllers
                .reserveDate

        )

        router.put(

            "/reserve/delete",

            this.controllers
                .deleteReserveById
        )
        router.put(

            "/reserve/deleteByUsername",

            this.controllers
                .deleteUserReserves
        )

        router.put(

            '/reserve/clean',
            IsAdmin.requireAdmin,

            this.controllers
                .deleteOldReserves

        )

        router.put(

            '/reserve/userUpdate',

            this.controllers
                .updateReservesUser

        )

        router.put('/:name', IsAdmin.requireAdmin, this.controllers.update);
        return router
    }
}
