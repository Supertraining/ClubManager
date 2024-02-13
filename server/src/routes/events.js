import { Router } from "express";
import { IsAuthenticated } from "../middlewares/isAuthenticated.js";

const router = Router();
export default class EventRouter {

  constructor(eventControllers) {

    this.controllers = eventControllers;

  }

  start() {

    router.use(IsAuthenticated.checkJwt)

    router.get('/', this.controllers.getAllEvents);
    router.get('/eventById/:id', this.controllers.getEventById);
    router.post('/createEvent', this.controllers.insertEvent);
    router.put('/updateEvent', this.controllers.updateEvent);
    router.delete('/deleteById/:id', this.controllers.deleteEvent);

    return router

  }

}