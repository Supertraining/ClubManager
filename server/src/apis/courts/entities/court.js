import { CustomError } from "../../../utils/customError.Utils";

export default class CourtEntity {
  #unavailableDates
  #_id
  #name

  constructor({ unavailableDates, _id, name }) {

    this.#unavailableDates = unavailableDates;
    this.#_id = _id;
    this.#name = name;
  }

  get unavailableDates() {
    return this.#unavailableDates
  }
  set unavailableDates(unavailableDates) {
    if (!unavailableDates) {
      throw CustomError.internalError('UnavailableDates is requested value')
    }
    this.#unavailableDates = unavailableDates
  }
  get id() {
    return this.#_id
  }
  set id(_id) {
    if (!_id) {
      throw CustomError.internalError('Id is requested value')
    }
    this.#_id = id
  }
  get name() {
    return this.#name
  }
  set name(name) {
    if (!name) {
      throw CustomError.internalError('Name is requested value')
    }
    this.#name = name
  }
}