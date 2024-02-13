import { Router } from 'express';
import { validate } from '../middlewares/dataValidator.js';
import { IsAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();
export default class ActivityRouter {
  constructor(activityController) {
    this.activityControllers = activityController;
  }
  start() {
    
    router.get('/getAll', this.activityControllers.getAll);

    router.use(IsAuthenticated.checkJwt)

    router.post('/save', validate.activity, this.activityControllers.save);
    router.get('/getById/:id', validate.activityId, this.activityControllers.getById);
    router.put('/update/:id', validate.activityUpdate, this.activityControllers.update);
    router.delete('/deleteById/:id', this.activityControllers.delete);
    router.delete('/deleteAll', this.activityControllers.deleteAll);

    return router;
  }
}