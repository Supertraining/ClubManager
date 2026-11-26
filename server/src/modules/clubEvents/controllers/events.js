export default class EventControllers {
  constructor(eventServices) {
    this.services = eventServices;
  }

  getAllEvents = async (req, res, next) => {
    try {
      const data = await this.services.getAllEvents(req.club.id, req.accessToken);
      res.json(data);
    } catch (error) { next(error); }
  };

  getEventById = async (req, res, next) => {
    try {
      const data = await this.services.getEventById(req.params.id, req.club.id, req.accessToken);
      res.json(data);
    } catch (error) { next(error); }
  };

  insertEvent = async (req, res, next) => {
    try {
      const newEvent = await this.services.insertEvent(req.body, req.club.id, req.accessToken);
      res.status(201).json(newEvent);
    } catch (error) { next(error); }
  };

  updateEvent = async (req, res, next) => {
    try {
      const updatedEvent = await this.services.updateEvent(req.body, req.club.id, req.accessToken);
      res.json(updatedEvent);
    } catch (error) { next(error); }
  };

  deleteEvent = async (req, res, next) => {
    try {
      const deletedEvent = await this.services.deleteEvent(req.params.id, req.club.id, req.accessToken);
      res.json(deletedEvent);
    } catch (error) { next(error); }
  };
}
