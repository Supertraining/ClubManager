import MongoDao from "../../../core/dao/mongoDb.dao.js";
import { Logger } from "../../../utils/logger.js";

let instance = null;
export default class ActivityRepository extends MongoDao {
  constructor(activitiesModel) {
    super(activitiesModel);
  }

  static getInstance(activityModel) {
    if (!instance) {
      instance = new ActivityRepository(activityModel);

      Logger.level().info("Se ha creado una instancia de ActivityDAO");

      return instance;
    }

    Logger.level().info("Se ha utilizado una instancia ya creada de ActivityDAO");

    return instance;
  }
}
