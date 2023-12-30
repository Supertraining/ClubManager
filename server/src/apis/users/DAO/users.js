import * as model from '../../../db/models/user.js';
import logger from '../../../utils/logger.js';

let instance = null;

export default class UsersDAO {

  async register(data) {
    try {

      let newUser = await model
        .usermodel
        .insertMany(data);
      return newUser[ 0 ];

    } catch (error) {

      throw(error)

    }

  }

  async getByUserName(username) {

    try {

      let data = await model
        .usermodel
        .findOne({ username: username });
      
      if (!data) {
        let error = createError(404, 'User not found');
        throw error;
      }

      return data;

    } catch (error) {

      throw(error)

    }

  }

  async deleteById(id) {

    try {

      const data = await model
        .usermodel
        .deleteOne({ _id: id });

      return data;

    } catch (error) {

      throw(error)

    }

  }

  async getAllUsers() {

    try {

      const data = await model
        .usermodel
        .find();

      return data

    } catch (error) {

      throw(error)

    }

  }

  async getById(id) {

    try {

      const data = await model
        .usermodel
        .findById(id);

      return data;

    } catch (error) {

      throw(error)

    }
  }

  async updateUserPassword(data) {

    try {

      const updatedUser = await model
        .usermodel
        .updateOne({ _id: data._id }, { $set: data });

      return updatedUser;

    } catch (error) {

      throw(error)

    }

  }
  async updateUser(id, data) {

    try {

      const updatedUser = await model
        .usermodel
        .updateOne({ _id: id }, { $set: data });

      return updatedUser;

    } catch (error) {

      throw(error)

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

              [ `reserves` ]: reserveData

            }
          }
        );

      return data;

    } catch (error) {

      throw(error)

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

              [ `reserves` ]: { id: reserveId }

            }
          }
        );

      return data;

    } catch (error) {

      throw(error)

    }
  }

  static getInstance() {
    try {

      if (!instance) {

        instance = new UsersDAO();

        logger.info('Se ha creado una instancia de UsersDAO');

      }

      logger.info('Se ha utilizado una instancia ya creada de usersDAO');

      return instance;

    } catch (error) {

      throw(error)

    }

  }

}


