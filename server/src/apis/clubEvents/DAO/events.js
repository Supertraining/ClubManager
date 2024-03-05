import { Logger } from "../../../utils/logger.js";

let instance = null;
export default class EventDAO {

  constructor(eventModel) {
    this.model = eventModel
  }


  async getAllEvents() {

    try {

      const data = await this.model
        .find();
      return data;

    } catch (error) {

      throw (error)

    }

  }

  async getEventById(id) {

    try {

      const data = await this.model
        .findById(id);

      return data;

    } catch (error) {

      throw (error)

    }

  }

  async insertEvent(data) {

    try {

      const newEvent = await this.model
        .insertMany(data);
      return newEvent;
    } catch (error) {

      throw (error)

    }

  }

  async updateEvent(data) {

    try {

      const updatedEvent = await this.model
        .updateOne({ _id: data.id }, { $set: { ...data } });
      return updatedEvent;
    } catch (error) {

      throw (error)

    }

  }

  async deleteEvent(id) {

    try {

      const deletedEvent = await this.model
        .deleteOne({ _id: id });

      return deletedEvent;

    } catch (error) {

      throw (error)

    }

  }

  static getInstance(eventModel) {
    try {

      if (!instance) {

        instance = new EventDAO(eventModel);

        Logger.level().info('Se ha creado una instancia de EventDAO');
        return instance;
      }

      Logger.level().info('Se ha utilizado una instancia ya creada de EventDAO');
      return instance;

    } catch (error) {

      throw (error);

    }

  }

}