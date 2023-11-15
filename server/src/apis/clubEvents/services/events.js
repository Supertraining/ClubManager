import EventDAO from "../DAO/events.js";
import logger from '../../../utils/logger.js'

export default class EventServices {

  constructor() {

    this.EventDAO = EventDAO.getInstance();

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

  async updateEvent(data) {
    try {

      const updatedEvent = await this.EventDAO
        .updateEvent(data);
      
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


