import { CustomError } from "../../../utils/customError.Utils.js"


export default class UserEntity {
  #_id
  #username
  #password
  #nombre
  #apellido
  #edad
  #telefono
  #reserves
  #admin

  constructor({_id, username, password, nombre, apellido, edad, telefono, reserves, admin }) {
    
    this.#_id = _id
    this.#username = username
    this.#password = password
    this.#nombre = nombre
    this.#apellido = apellido
    this.#edad = edad
    this.#telefono = telefono
    this.#reserves = reserves
    this.#admin = admin
  
  }

  get id() {

    return this.#_id;

  }
  set id(_id) {

    if (!_id) {

      throw CustomError.internalError('id is a requested field');

    }

    this.#_id = _id;
  }
  get username() {

    return this.#username;

  }
  set username(username) {

    if (!username) {

      throw CustomError.internalError('username is a requested field');

    }

    this.#username = username;
  }

  get password() {

    return this.#password;

  }
  set password(password) {

    if (!password) {

      throw CustomError.internalError('password is a requested field');

    }

    this.#password = password;

  }

  get nombre() {

    return this.#nombre;

  }
  set nombre(nombre) {

    if (!nombre) {

      throw CustomError.internalError('name is a requested field');

    }

    this.#nombre = nombre;

  }

  get apellido() {

    return this.#apellido;

  }
  set apellido(apellido) {

    if (!apellido) {

      throw CustomError.internalError('lastname is a requested field');

    }

    this.#apellido = apellido;

  }

  get edad() {

    return this.#edad;

  }
  set edad(edad) {

    if (!edad) {

      throw CustomError.internalError('age is a requested field');

    }

    if (isNaN(edad)) {

      logger.error('La edad debe ser un numero');

    }

    this.#edad = edad;
  }

  get telefono() {

    return this.#telefono;

  }
  set telefono(telefono) {

    if (!telefono) {

      throw CustomError.internalError('phone is a requested field');

    }

    this.#telefono = telefono;
  }

  get reserves() {

    return this.#reserves;

  }
  set reserves(reserves) {

    if (!reserves) {

      throw CustomError.internalError('reserves is a requested field');

    }

    this.#reserves = reserves;
  }

  get admin() {

    return this.#admin;

  }
  set admin(admin) {

    if (admin === undefined) {

      throw CustomError.internalError('admin is a requested field');

    }

    this.#admin = admin

  }

  datos() {

    return JSON.parse(JSON.stringify(

      {
        _id: this.#_id,
        username: this.#username,
        password: this.#password,
        nombre: this.#nombre,
        apellido: this.#apellido,
        edad: this.#edad,
        telefono: this.#telefono,
        reserves: this.#reserves,
        admin: this.#admin
      }

    ))

  }

}