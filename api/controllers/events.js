import EventServices from "../services/events.js";
import routeLogger from "../utils/logger.js";

export default class EventControllers {

  constructor() {

    this.services = new EventServices();

  }

  getAllEvents = async (req, res) => {

    try {

      const data = await this.services.getAllEvents();

      res.json(data)

    } catch (error) {

      routeLogger(req, 'error', error);

    }

  }
  getEventById = async (req, res) => {

    try {

      const data = await this.services.getEventById(req.id);

      res.json(data);

    } catch (error) {

      routeLogger(req, 'error', error);

    }

  }

  insertEvent = async (req, res) => {
    try {
    
      const newEvent = await this.services.insertEvent(req.body)

      res.json(newEvent)

    } catch (error) {
      
      routeLogger(req, 'error', error);
      
    }

  }

  updateEvent = async (req, res) => {
    try {

      const updatedEvent = await this.services.updateEvent(req.id, req.data);

      res.json(updatedEvent);
      
    } catch (error) {

      routeLogger(req, 'error', error);
      
    }
  }

  deleteEvent = async (req, res) => {
    
    try {
    
      const deletedEvent = await this.services.deleteEvent(req.params.id);

      res.json(deletedEvent);
      
    } catch (error) {

      routeLogger(req, 'error', error);
      
    }

  }

}