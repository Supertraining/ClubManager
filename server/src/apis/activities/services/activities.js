import ActivityDAO from "../DAO/activities.js";
import createError from '../../../utils/createError.Utils.js'
export default class ActivityServices {
  constructor() {
    this.activityServices = ActivityDAO.getInstance();
  }
  save = async (activityData) => {
    try {
      const activity = await this.activityServices.save(activityData);
      return activity
    } catch (error) {
      throw (error)
    }
  }

  getAll = async () => {
    try {
      const activity = await this.activityServices.getAll();
      return activity
    } catch (error) {
      throw (error)
    }
  }

  getById = async (id) => {
    try {
      const activity = await this.activityServices.getById(id);
      if (!activity) {
        let error = createError(404, 'La actividad no existe');
        throw error;
      }
      return activity;
    } catch (error) {
      throw (error)
    }
  }

  update = async (data) => {
    try {
      const activity = await this.activityServices.update(data);
      if (activity.matchedCount === 0) {

        let error = createError(404, `Usuario con el Id: ${id} no encontrado`);

        throw error

      }
      if (activity.modifiedCount === 0 && activity.matchedCount === 1) {

        let error = createError(400, `Usuario con el Id: ${id} no ha sido modificado`);

        throw error

      }
      return activity;
    } catch (error) {
      throw (error)
    }
  }

  delete = async (id) => {
    try {
      const activity = await this.activityServices.delete(id);

      if (activity.deletedCount === 0) {
        let error = createError(404, 'La actividad no existe');
        throw error;
      }

      return activity;

    } catch (error) {
      throw (error)
    }
  }

  deleteAll = async () => {
    try {
      const activity = await this.activityServices.deleteAll();
      return activity;
    } catch (error) {
      throw (error)
    }
  }

}