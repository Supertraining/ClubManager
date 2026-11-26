import { CustomError } from "../../../utils/customError.Utils.js";

export default class ActivityServices {
  constructor(activityDAO) {
    this.repository = activityDAO;
  }

  save = async (activityData, clubId, token) => {
    return this.repository.save(activityData, clubId, token);
  };

  getAll = async (clubId) => {
    return this.repository.getAll(clubId);
  };

  getById = async (id, clubId, token) => {
    const activity = await this.repository.getById(id, clubId, token);
    if (!activity) throw CustomError.notFound(`Actividad ${id} no encontrada`);
    return activity;
  };

  update = async (id, data, clubId, token) => {
    const result = await this.repository.update(id, data, clubId, token);
    if (!result) throw CustomError.notFound(`Actividad ${id} no encontrada`);
    return result;
  };

  delete = async (id, clubId, token) => {
    return this.repository.delete(id, clubId, token);
  };

  deleteAll = async (clubId, token) => {
    return this.repository.deleteAll(clubId, token);
  };
}
