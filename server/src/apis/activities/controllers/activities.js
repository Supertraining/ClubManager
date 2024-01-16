import ActivityServices from "../services/activities.js";
import { routeLogger } from "../../../utils/logger.js";

export default class ActivityControllers {
  constructor() {
    this.activityControllers = new ActivityServices();
  }

  save = async (req, res, next) => {
    try {
      const activity = await this.activityControllers.save(req.body);
      res.json(activity);
    } catch (error) {
      next(error)
    }
  }
  getAll = async (req, res, next) => {
    try {
      const activity = await this.activityControllers.getAll();
      res.json(activity);
    } catch (error) {
      next(error)
    }
  }
  getById = async (req, res, next) => {
    try {
      const activity = await this.activityControllers.getById(req.params.id);
      res.json(activity);
    } catch (error) {
      next(error)
    }
  }
  update = async (req, res, next) => {
    try {
      const activity = await this.activityControllers.update({id: req.params.id, ...req.body});
      res.json(activity);
    } catch (error) {
      next(error)
    }
  }
  delete = async (req, res, next) => {
    try {
      const activity = await this.activityControllers.delete(req.params.id);
      res.json(activity); 
    } catch (error) {
      next(error)
    }
  }
  deleteAll = async (req, res, next) => {
    try {
      const activity = await this.activityControllers.deleteAll();
      res.json(activity); 
    } catch (error) {
      next(error)
    }
  }
}