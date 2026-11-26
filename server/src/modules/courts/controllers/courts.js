export default class CourtsControllers {
  constructor(courtServices) {
    this.courtsService = courtServices;
  }

  save = async (req, res, next) => {
    try {
      const data = await this.courtsService.save(req.body, req.club.id, req.accessToken);
      res.json(data);
    } catch (error) { next(error); }
  };

  update = async (req, res, next) => {
    try {
      res.json(await this.courtsService.save(req.body, req.club.id, req.accessToken, req.params.name));
    } catch (error) { next(error); }
  };

  availability = async (req, res, next) => {
    try {
      res.json(await this.courtsService.availability(req.params.name, req.query, req.club.id, req.accessToken));
    } catch (error) { next(error); }
  };

  getAll = async (req, res, next) => {
    try {
      const data = await this.courtsService.getAll(req.club.id);
      res.json(data);
    } catch (error) { next(error); }
  };

  deleteCourtById = async (req, res, next) => {
    try {
      const data = await this.courtsService.deleteCourtById(req.params.id, req.club.id, req.accessToken);
      res.json(data.deletedCount > 0);
    } catch (error) { next(error); }
  };

  getUnavailableDatesByName = async (req, res, next) => {
    try {
      const data = await this.courtsService.getUnavailableDatesByName(req.params.name, req.club.id, req.accessToken);
      res.json(data);
    } catch (error) { next(error); }
  };

  reserveDate = async (req, res, next) => {
    try {
      const data = await this.courtsService.reserveDate(req.body, req.club.id, req.accessToken);
      res.json(data);
    } catch (error) { next(error); }
  };

  deleteReserveById = async (req, res, next) => {
    try {
      const reserveId = req.params.reserveId ?? req.body.reserveId;
      const data = await this.courtsService.deleteReserveById(reserveId, req.club.id, req.accessToken);
      res.json(data);
    } catch (error) { next(error); }
  };

  deleteUserReserves = async (req, res, next) => {
    try {
      const data = await this.courtsService.deleteUserReserves(req.body, req.accessToken);
      res.json(data);
    } catch (error) { next(error); }
  };

  deleteOldReserves = async (req, res, next) => {
    try {
      const data = await this.courtsService.deleteOldReserves(req.club.id, req.accessToken);
      res.json(data);
    } catch (error) { next(error); }
  };

  updateReservesUser = async (req, res, next) => {
    try {
      const data = await this.courtsService.updateReservesUser(req.body);
      res.json(data);
    } catch (error) { next(error); }
  };
}
