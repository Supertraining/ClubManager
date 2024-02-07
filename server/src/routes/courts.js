import { Router } from "express";
import { validate } from "../middlewares/dataValidator.js";
import { IsAuthenticated } from "../middlewares/isAuthenticated.js";

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
        
        router.get(
            
            "/:name",
            
            this.controllers
                .getUnavailableDatesByName
            
        )
        
        router.post(

            "/createCourt",

            this.controllers
                .save
            
        )

        router.delete(

            "/delete/:id",

            this.controllers
                .deleteCourtById
            
        )

        router.put(

            "/reserve",

            validate.courtReservation,

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

            IsAuthenticated.checkJwt,

            this.controllers
                .deleteUserReserves
        )

        router.put(

            '/reserve/clean',

            this.controllers
                .deleteOldReserves
            
        )
        
        router.put(

            '/reserve/userUpdate',

            IsAuthenticated.checkJwt,

            this.controllers
                .updateReservesUser
            
        )

        return router
    }
}