import logger from "../../../utils/logger.js";

let instance = null;
export default class ActivityDAO {

  constructor(activitiesModel) {
    this.model = activitiesModel
  }

  save = async (activityData) => {
    try {
      const activity = await this.model
        .create(activityData);
      return activity;
    } catch (error) {
      throw(error)
    }
  }
  getAll = async () => {
    try {
      const activity = await this.model
        .find();
      return activity;
    } catch (error) {
      throw(error)
    }
  }
  getById = async (id) => {
    try {
      const activity = await this.model.findOne({ _id: id });
      return activity;
    } catch (error) {
      throw(error)
    }
  }
  update = async (data) => {
    try {

      const activity = await this.model
        .findByIdAndUpdate(data.id, { ...data });
      return activity;
    } catch (error) {
      throw(error)
    }
  }
  delete = async (id) => {
    try {
      const activity = await this.model
        .deleteOne({ _id: id });
      return activity;

    } catch (error) {
      throw(error)
    }
  }
  deleteAll = async () => {
    try {
      const activity = await this.model
        .deleteMany();
      return activity;

    } catch (error) {
      throw(error)
    }
  }
  static getInstance(activityModel) {
    try {
      
      if (!instance) {

        instance = new ActivityDAO(activityModel);

        logger.info('Se ha creado una instancia de ActivityDAO');

        return instance;
      }

      logger.info('Se ha utilizado una instancia ya creada de ActivityDAO');

      return instance;
      
    } catch (error) {

    }
  }
}