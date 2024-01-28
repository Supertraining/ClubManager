import * as model from '../../../db/models/events.js';
import logger from '../../../utils/logger.js';

let instance = null;
export default class EventDAO {


  async getAllEvents() {

    try {

      const data = await model
        .eventModel
        .find();
      return data;

    } catch (error) {

      throw(error)

    }

  }

  async getEventById(id) {

    try {

      const data = await model
        .eventModel
        .findById(id);

      return data;

    } catch (error) {

      throw(error)

    }

  }

  async insertEvent(data) {

    try {

      const newEvent = await model
        .eventModel
        .insertMany(data);

    } catch (error) {

      throw(error)

    }

  }

  async updateEvent(data) {

    try {

      const updatedEvent = await model
        .eventModel
        .updateOne({ _id: data.id }, { $set: {...data} });

    } catch (error) {

      throw(error)

    }

  }

  async deleteEvent(id) {

    try {

      const data = await model
        .eventModel
        .deleteOne({ _id: id });

    } catch (error) {

      throw(error)

    }

  }

  static getInstance() {
    try {

      if (!instance) {

        instance = new EventDAO();

        logger.info('Se ha creado una instancia de EventDAO');
        return instance;
      }

      logger.info('Se ha utilizado una instancia ya creada de EventDAO');
      return instance;

    } catch (error) {

      throw (error);

    }

  }

}