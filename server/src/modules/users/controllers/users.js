export default class UsersController {

  constructor(userServices) {
    this.userServices = userServices;
  }

  register = async (req, res, next) => {
    try {
      const result = await this.userServices.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const result = await this.userServices.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req, res, next) => {
    try {
      const users = await this.userServices.getAllUsers(req.accessToken);
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const user = await this.userServices.getById(req.params.id, req.accessToken);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const updated = await this.userServices.updateUser(req.params.id, req.body, req.accessToken);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  updateUserPassword = async (req, res, next) => {
    try {
      const updated = await this.userServices.updateUserPassword(req.body, req.accessToken);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  deleteById = async (req, res, next) => {
    try {
      const result = await this.userServices.deleteById(req.params.id, req.accessToken);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getMyReserves = async (req, res, next) => {
    try {
      const list = await this.userServices.getMyReservations(req.accessToken);
      res.json(list);
    } catch (error) {
      next(error);
    }
  };

  deleteReserveById = async (req, res, next) => {
    try {
      const result = await this.userServices.deleteMyReservation(
        req.params.reserveId ?? req.body.reserveId,
        req.accessToken,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getByUserName = async (req, res, next) => {
    // Legacy endpoint — clients still hit /users/user (no id) with the
    // username in the Authorization header. Map to the current user.
    try {
      const id = req.user?.id;
      if (!id) throw Object.assign(new Error('No user in session'), { statusCode: 401 });
      const user = await this.userServices.getById(id, req.accessToken);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUserReserves = async (_req, res) => {
    // No-op in Supabase: reservations live in their own table now, not on
    // the user document. Kept so legacy client routes don't 404. New clients
    // should use POST /courts/reserve (RPC) and DELETE /users/reserves/:id.
    res.status(410).json({
      message: 'updateUserReserves ya no se usa. Usá POST /courts/reserve (RPC create_reservation) en su lugar.',
    });
  };
}
