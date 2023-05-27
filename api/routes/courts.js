import { Router } from "express";
import CourtsControllers from "../controllers/courts.js";

const router = Router();

export default class CourtsRouter {
    constructor() {
        this.controllers = new CourtsControllers();
    }

    start() {
        router.get("/", this.controllers.getAll)
        router.get("/:name", this.controllers.getUnavailableDatesByName)
        router.post("/createCourt", this.controllers.save)
        router.put("/reserve", this.controllers.reserveDate)
        router.put("/reserve/delete", this.controllers.deleteReserveById)
        router.put('/reserve/clean', this.controllers.deleteOldReserves)
        // router.put("/",)

        return router
    }
}