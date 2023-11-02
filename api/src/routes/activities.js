import { Router } from 'express';
import ActivityControllers from '../apis/activities/controllers/activities.js';
import { validate } from './middlewares/dataValidator.js';

const router = Router();
export default class ActivityRouter {
  constructor() {
    this.activityControllers = new ActivityControllers();
  }
  start() {
    router.post('/save', validate.activity, this.activityControllers.save);
    router.get('/getAll', this.activityControllers.getAll);
    router.get('/getById/:id', validate.activityId, this.activityControllers.getById);
    router.put('/update/:id', validate.activityUpdate, this.activityControllers.update);
    router.delete('/deleteById/:id', this.activityControllers.delete);
    router.delete('/deleteAll', this.activityControllers.deleteAll);

    return router;
  }
}