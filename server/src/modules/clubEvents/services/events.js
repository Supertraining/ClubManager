import { CustomError } from "../../../utils/customError.Utils.js";

export default class EventServices {
  constructor(eventDAO) {
    this.EventDAO = eventDAO;
  }

  getAllEvents = async (clubId, token) => this.EventDAO.getAllEvents(clubId, token);

  getEventById = async (id, clubId, token) => {
    const event = await this.EventDAO.getEventById(id, clubId, token);
    if (!event) throw CustomError.notFound('Evento no encontrado.');
    return event;
  };

  insertEvent = async (data, clubId, token) => this.EventDAO.insertEvent(data, clubId, token);

  updateEvent = async (data, clubId, token) => {
    if (!data?.id) throw CustomError.badRequest('Falta el id del evento');
    const updated = await this.EventDAO.updateEvent(data, clubId, token);
    if (!updated) throw CustomError.notFound('Evento no encontrado.');
    return updated;
  };

  deleteEvent = async (id, clubId, token) => {
    const result = await this.EventDAO.deleteEvent(id, clubId, token);
    if (result.deletedCount === 0) throw CustomError.notFound('Evento no encontrado.');
    return result;
  };
}
