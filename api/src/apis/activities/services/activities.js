import ActivityDAO from "../DAO/activities.js";
import logger from "../../../utils/logger.js";

export default class ActivityServices {
  constructor() {
    this.activityServices = ActivityDAO.getInstance();
  }
  save = async (activityData) => {
    try {
      const activity = await this.activityServices.save(activityData);
      return activity
    } catch (error) {
      logger.error(error);
    }
  }

  getAll = async () => {
    try {
      const activity = await this.activityServices.getAll();
      return activity
    } catch (error) {
      logger.error(error);
    }
  }

  getById = async (id) => {
    try {
      const activity = await this.activityServices.getById(id);
      return activity;
    } catch (error) {
      logger.error(error);
    }
  }

  update = async (data) => {
    try {
      const activity = await this.activityServices.update(data);
      return activity;
    } catch (error) {
      logger.error(error);
    }
  }

  delete = async (id) => {
    try {
      const activity = await this.activityServices.delete(id);
      return activity;
    } catch (error) {
      logger.error(error);
    }
  }

  deleteAll = async () => {
    try {
      const activity = await this.activityServices.deleteAll();
      return activity;
    } catch (error) {
      logger.error(error);
    }
  }
  
}