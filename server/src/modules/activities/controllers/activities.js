export default class ActivityControllers {
  constructor(activityService) {
    this.activityControllers = activityService;
  }

  save = async (req, res, next) => {
    try {
      const activity = await this.activityControllers.save(req.body, req.club.id, req.accessToken);
      res.json(activity);
    } catch (error) {
      next(error)
    }
  }
  getAll = async (req, res, next) => {
    try {
      const activity = await this.activityControllers.getAll(req.club.id);
  
       res.json(activity); 
      
    } catch (error) {
      next(error)
    }
  }
  getById = async (req, res, next) => {
    try {
      const activity = await this.activityControllers.getById(req.params.id, req.club.id, req.accessToken);
      res.json(activity);
    } catch (error) {
      next(error)
    }
  }
  update = async (req, res, next) => {
    try {
      const activity = await this.activityControllers.update(req.params.id, req.body, req.club.id, req.accessToken);
      res.json(activity);
    } catch (error) {
      next(error)
    }
  }
  delete = async (req, res, next) => {
    try {
      const activity = await this.activityControllers.delete(req.params.id, req.club.id, req.accessToken);
      res.json(activity); 
    } catch (error) {
      next(error)
    }
  }
  deleteAll = async (req, res, next) => {
    try {
      const activity = await this.activityControllers.deleteAll(req.club.id, req.accessToken);
      res.json(activity); 
    } catch (error) {
      next(error)
    }
  }
}