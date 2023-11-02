import ActivityServices from "../services/activities.js";
import { routeLogger } from "../../../utils/logger.js";

export default class ActivityControllers {
  constructor() {
    this.activityControllers = new ActivityServices();
  }

  save = async (req, res) => {
    try {
      const activity = await this.activityControllers.save(req.body);
      res.json(activity);
    } catch (error) {
      routeLogger(req, 'error', error)
    }
  }
  getAll = async (req, res) => {
    try {
      const activity = await this.activityControllers.getAll();
      res.json(activity);
    } catch (error) {
      routeLogger(req, 'error', error)
    }
  }
  getById = async (req, res) => {
    try {
      const activity = await this.activityControllers.getById(req.params.id);
      res.json(activity);
    } catch (error) {
      routeLogger(req, 'error', error)
    }
  }
  update = async (req, res) => {
    try {
      const activity = await this.activityControllers.update({id: req.params.id, ...req.body});
      res.json(activity);
    } catch (error) {
      routeLogger(req, 'error', error)
    }
  }
  delete = async (req, res) => {
    try {
      const activity = await this.activityControllers.delete(req.params.id);
      res.json(activity); 
    } catch (error) {
      routeLogger(req, 'error', error)
    }
  }
  deleteAll = async (req, res) => {
    try {
      const activity = await this.activityControllers.deleteAll();
      res.json(activity); 
    } catch (error) {
      routeLogger(req, 'error', error)
    }
  }
}