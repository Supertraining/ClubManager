import EventControllers from "../apis/clubEvents/controllers/events.js";
import { Router } from "express";

const router = Router();
export default class EventRouter {

  constructor() {

    this.controllers = new EventControllers();

  }

  start() {

    router.get('/', this.controllers.getAllEvents);
    router.get('/eventById/:id', this.controllers.getEventById);
    router.post('/createEvent', this.controllers.insertEvent);
    router.put('/updateEvent', this.controllers.updateEvent);
    router.delete('/deleteById/:id', this.controllers.deleteEvent);

    return router

  }

}