import { CustomError } from "../../../utils/customError.Utils.js";

export default class EventServices {

  constructor(eventDAO) {

    this.EventDAO = eventDAO;

  }

  async getAllEvents() {
    try {

      const data = await this.EventDAO
        .getAllEvents();

      return data

    } catch (error) {

      throw (error)

    }
  }
  async getEventById(id) {

    try {

      const event = await this.EventDAO
        .getEventById(id);

      if (!event) {
        throw CustomError.notFound('Event not found')
      }


      return event

    } catch (error) {

      if (error.kind === 'ObjectId') {
        throw CustomError.badRequest('Id incorrecta')
      }

      throw (error)

    }

  }

  async insertEvent(data) {
    try {

      const newEvent = await this.EventDAO
        .insertEvent(data);

      return newEvent

    } catch (error) {

      throw (error)

    }

  }

  async updateEvent(data) {
    try {

      const updatedEvent = await this.EventDAO
        .updateEvent(data);

      if (updatedEvent.matchedCount === 0) {

        throw CustomError.notFound(`Usuario con el Id: ${id} no encontrado`)

      }
      if (updatedEvent.modifiedCount === 0 && updatedEvent.matchedCount === 1) {

        throw CustomError.badRequest(`Usuario con el Id: ${id} no ha sido modificado`)

      }

      return updatedEvent

    } catch (error) {

      throw (error)

    }

  }

  async deleteEvent(id) {

    try {

      const deletedEvent = await this.EventDAO
        .deleteEvent(id);
      
      if (deletedEvent.deletedCount === 0) {
        throw CustomError.notFound('El usuarios no existe');
      }

      return deletedEvent

    } catch (error) {

      if (error.kind === 'ObjectId') {
        throw CustomError.badRequest('Id incorrecta')
      }

      throw (error)

    }

  }

}


