import { Router } from "express";
import CourtsControllers from "../apis/courts/controllers/courts.js";
import { validate } from "../middlewares/dataValidator.js";

const router = Router();

export default class CourtsRouter {
    constructor() {
        this.controllers = new CourtsControllers();
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

            this.controllers
                .updateReservesUser
            
        )

        return router
    }
}