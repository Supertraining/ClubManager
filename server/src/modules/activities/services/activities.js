import { CustomError } from "../../../utils/customError.Utils.js";
export default class ActivityServices {
  constructor(activityRepository) {
    this.activityRepository = activityRepository;
  }
  save = async (activityData) => {
    const activity = await this.activityRepository.save(activityData);
    return activity;
  };

  getAll = async () => {
    const activity = await this.activityRepository.getAll();
    return activity;
  };

  getById = async (id) => {
    try {
      const activity = await this.activityRepository.getById(id);

      if (!activity) {
        throw CustomError.notFound("El usuarios no existe");
      }

      return activity;
    } catch (error) {
      if (error.kind === "ObjectId") {
        throw CustomError.badRequest("Id incorrecta");
      }
      throw error;
    }
  };

  update = async (id, data) => {
    const activity = await this.activityRepository.update(id, data);

    if (activity.matchedCount === 0) {
      throw CustomError.notFound(`La actividad con el Id: ${id} no encontrado`);
    }
    if (activity.modifiedCount === 0 && activity.matchedCount === 1) {
      throw CustomError.badRequest(`La actividad con el Id: ${id} no ha sido modificado`);
    }

    return activity;
  };

  delete = async (id) => {
    try {
      const activity = await this.activityRepository.delete(id);

      if (activity.matchedCount === 0) {
        throw CustomError.notFound(`La actividad con el Id: ${reserveId} no encontrada`);
      }

      return activity;
    } catch (error) {
      if (error.kind === "ObjectId") {
        throw CustomError.badRequest("Id incorrecta");
      }
      throw error;
    }
  };

  deleteAll = async () => {
    const activity = await this.activityRepository.deleteAll();
    return activity;
  };
}
