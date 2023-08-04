import * as model from '../models/events.js';
import logger from '../utils/logger.js';

let instance = null;
export default class EventDAO {


  async getAllEvents() {

    try {

      const data = await model
        .eventModel
        .find();
      return data;

    } catch (err) {

      logger.error(err);

    }

  }

  async getEventById(id) {

    try {

      const data = await model
        .eventModel
        .findById(id);

      return data;

    } catch (err) {

      logger.error(err);

    }

  }

  async insertEvent(data) {

    try {

      const newEvent = await model
        .eventModel
        .insertMany(data);

    } catch (err) {

      logger.error(err);

    }

  }

  async updateEvent(id, data) {

    try {

      const updatedEvent = await model
        .eventModel
        .updateOne({ _id: id }, { $set: data });

    } catch (err) {

      logger.error(err);

    }

  }

  async deleteEvent(id) {

    try {

      const data = await model
        .eventModel
        .deleteOne({ _id: id });

    } catch (err) {

      logger.error(err);

    }

  }

  static getInstance() {
    try {

      if (!instance) {

        instance = new EventDAO();

        logger.info('Se ha creado una instancia de EventDAO');

      }

      logger.info('Se ha utilizado una instancia ya creada de EventDAO');
      return instance;

    } catch (error) {

      logger.error(error);

    }

  }

}