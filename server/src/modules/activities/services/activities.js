import { CustomError } from "../../../utils/customError.Utils.js";

export default class ActivityServices {
  constructor(activityDAO) {
    this.repository = activityDAO;
  }

  save = async (activityData) => {
    return this.repository.save(activityData);
  };

  getAll = async () => {
    return this.repository.getAll();
  };

  getById = async (id) => {
    const activity = await this.repository.getById(id);
    if (!activity) throw CustomError.notFound(`Actividad ${id} no encontrada`);
    return activity;
  };

  update = async (id, data) => {
    const result = await this.repository.update(id, data);
    if (!result) throw CustomError.notFound(`Actividad ${id} no encontrada`);
    return result;
  };

  delete = async (id) => {
    return this.repository.delete(id);
  };

  deleteAll = async () => {
    return this.repository.deleteAll();
  };
}
