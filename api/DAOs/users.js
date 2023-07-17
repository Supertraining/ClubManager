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
        .deleteOne({ _id: id });

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

  async updateUserPassword(data) {

    try {
      
      const updatedUser = await model
        .usermodel
        .updateOne({ _id: data._id }, { $set: data });
      
      return updatedUser;

    } catch (err) {

      logger.error(err);

    }

  }
  async updateUser(id, data) {

    try {
      
      const updatedUser = await model
        .usermodel
        .updateOne({ _id: id }, { $set: data });
      
      return updatedUser;

    } catch (err) {

      logger.error(err);

    }

  }
  async updateUserReserves(username, reserveData) {

    try {

      let data = await model
        .usermodel
        .updateOne(
          {
            username: username
          },
          {
            $push:
            {

              [`reserves`]: reserveData

            }
          }
        );

      return data;

    } catch (err) {

      logger.error(err);

    }

  }

  async deleteReserveById(username, reserveId) {

    try {

      let data = await model
        .usermodel
        .updateOne(
          {
            username: username
          },
          {
            $pull:
            {

              [`reserves`]: { id: reserveId }

            }
          }
        );

      return data;

    } catch (error) {

      logger.error(error);

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


