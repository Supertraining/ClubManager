import * as model from '../models/user.js';
import logger from '../utils/logger.js';

let instance = null;

export default class UsersDAO {

  async getByUserName(username) {

    try {

      let data = await model
        .usermodel
        .find({ username: username });

      return data;

    } catch (err) {

      logger.error(err);

    }

  }

  async insertUser(data) {

    try {

      let newUser = await model
        .usermodel
        .insertMany(data);

      return newUser;

    } catch (err) {

      logger.error(err);

    }

  }

  async deleteById(id) {

    try {

      const data = await model
        .usermodel
        .deleteMany({ _id: id });

      return data;

    } catch (err) {

      logger.error(err);

    }

  }

  async getAllUsers() {

    try {

      const data = await model
        .usermodel
        .find();

      return data

    } catch (err) {

      logger.error(err);

    }

  }

  async getById(id) {

    try {

      const data = await model
        .usermodel
        .findById(id);

      return data;

    } catch (err) {

      logger.error(err);

    }
  }

  async updateUser(id, data) {

    try {

      const updateUser = await model
        .usermodel
        .updateMany({ _id: id }, data);

      return updateUser;

    } catch (err) {

      logger.error(err);

    }

  }

  static async getInstance() {
    try {

      if (!instance) {

        instance = new UsersDAO();

        logger.info('Se ha creado una instancia de UsersDAO');

      }

      logger.info('Se ha utilizado una instancia ya creada de usersDAO');

      return await instance;

    } catch (error) {

      logger.error(error);

    }

  }

}


