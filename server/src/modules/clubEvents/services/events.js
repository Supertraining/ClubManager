import { CustomError } from "../../../utils/customError.Utils.js";

export default class EventServices {
  constructor(eventDAO) {
    this.EventDAO = eventDAO;
  }

  getAllEvents = async () => this.EventDAO.getAllEvents();

  getEventById = async (id) => {
    const event = await this.EventDAO.getEventById(id);
    if (!event) throw CustomError.notFound('Event not found');
    return event;
  };

  insertEvent = async (data) => this.EventDAO.insertEvent(data);

  updateEvent = async (data) => {
    if (!data?.id) throw CustomError.badRequest('Falta el id del evento');
    const updated = await this.EventDAO.updateEvent(data);
    if (!updated) throw CustomError.notFound('Event not found');
    return updated;
  };

  deleteEvent = async (id) => {
    const result = await this.EventDAO.deleteEvent(id);
    if (result.deletedCount === 0) throw CustomError.notFound('Event not found');
    return result;
  };
}
