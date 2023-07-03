import EventDAO from "../DAOs/events.js";
import logger from '../utils/logger.js'

export default class EventServices {

  constructor() {

    this.EventDAO = new EventDAO();

  }

  async getAllEvents() {
    try {

      const data = await this.EventDAO
        .getAllEvents();

      return data

    } catch (error) {

      logger.error(error);

    }
  }
  async getEventById(id) {

    try {

      const data = await this.EventDAO
        .getEventById(id);

      return data

    } catch (error) {

      logger.error(error);

    }

  }

  async insertEvent(data) {
    try { 
      
      const newEvent = await this.EventDAO
        .insertEvent(data);
      
      return newEvent
      
    } catch (error) {

     logger.error(error); 
      
    }

  }

  async updateEvent(id, data) {
    try {

      const updatedEvent = await this.EventDAO
        .updateEvent(id, data);
      
      return updatedEvent
      
    } catch (error) {

      logger.error(error);
      
    }
    
  }

  async deleteEvent(id) {

    try {
      
      const deletedEvent = await this.EventDAO
        .deleteEvent(id);
      
      return deletedEvent

    } catch (error) {

      logger.error(error);
      
    }
    
  }

}


