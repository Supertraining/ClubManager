import ActivityDAO from "../DAO/activities.js";
import { CustomError } from "../../../utils/customError.Utils.js";
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

        throw CustomError.notFound('El usuarios no existe');

      }

      return activity;
    } catch (error) {
      if (error.kind === 'ObjectId') {
        throw CustomError.badRequest('Id incorrecta')
      }
      throw (error)
    }
  }

  update = async (data) => {
    try {
      const activity = await this.activityServices.update(data);

      if (activity.matchedCount === 0) {

        throw CustomError.notFound(`La actividad con el Id: ${id} no encontrado`)

      }
      if (activity.modifiedCount === 0 && activity.matchedCount === 1) {

        throw CustomError.badRequest(`La actividad con el Id: ${id} no ha sido modificado`)

      }

      return activity;

    } catch (error) {
      throw (error)
    }
  }

  delete = async (id) => {
    try {
      const activity = await this.activityServices.delete(id);

      if (activity.matchedCount === 0) {

        throw CustomError.notFound(`La actividad con el Id: ${reserveId} no encontrada`)

      }

      return activity;

    } catch (error) {
      if (error.kind === 'ObjectId') {
        throw CustomError.badRequest('Id incorrecta')
      }
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