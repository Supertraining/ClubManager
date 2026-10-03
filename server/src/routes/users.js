import { Router } from 'express';
import { validate } from '../middlewares/dataValidator.js';
import { IsAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

export default class UserRouter {
  constructor(userControllers) {
    this.controllers = userControllers;
  }

  start() {
    router.post(
      '/register',

      validate.user,

      this.controllers.register
    );

    router.post(
      '/login',

      this.controllers.login
    );

    router.use(IsAuthenticated.checkJwt)

    router.get(
      '/getAll',

      this.controllers.getAllUsers
    );

    router.get(
      '/user/:id',

      this.controllers.getById
    );

    router.delete(
      '/eliminar/:id',

      this.controllers.deleteById
    );

    router.put(
      '/reserves/delete',

      this.controllers.deleteReserveById
    );

    // Reservations belonging to the caller. The DAO scopes both of these to the
    // access token, so a socio can only read or cancel their own rows (RLS
    // backs it up on top of that).
    router.get(
      '/me/reserves',

      this.controllers.getMyReserves
    );

    router.delete(
      '/reserves/:reserveId',

      this.controllers.deleteReserveById
    );

    router.put(
      '/reserves/:username',

      validate.userReservation,

      this.controllers.updateUserReserves
    );

    router.put(
      '/update',

      validate.userUpdatePassword,

      this.controllers.updateUserPassword
    );

    router.put(
      '/update/:id',

      validate.userUpdate,

      this.controllers.updateUser
    );

    return router;
  }
}
