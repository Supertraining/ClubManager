
export default class EventControllers {

  constructor(eventControllers) {

    this.services = eventControllers;

  }

  getAllEvents = async (req, res, next) => {

    try {

      const data = await this.services.getAllEvents();

      res.json(data)

    } catch (error) {

      next(error)

    }

  }
  getEventById = async (req, res, next) => {

    try {

      const data = await this.services.getEventById(req.id);

      res.json(data);

    } catch (error) {

      next(error)

    }

  }

  insertEvent = async (req, res, next) => {
    try {

      const newEvent = await this.services.insertEvent(req.body)
      if(newEvent) res.json('Event successfully created')

    } catch (error) {

      next(error)

    }

  }

  updateEvent = async (req, res, next) => {
    try {

      const updatedEvent = await this.services.updateEvent(req.body);

      res.json(updatedEvent);

    } catch (error) {

      next(error)

    }
  }

  deleteEvent = async (req, res, next) => {

    try {

      const deletedEvent = await this.services.deleteEvent(req.params.id);

      res.json(deletedEvent);

    } catch (error) {

      next(error)

    }

  }

}