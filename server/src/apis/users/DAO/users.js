import * as model from '../../../db/models/user.js';
import logger from '../../../utils/logger.js';
import createError from '../../../utils/createError.Utils.js';

let instance = null;

export default class UsersDAO {

  async register(data) {
    try {

      let newUser = await model
        .usermodel
        .insertMany(data);
      return newUser[ 0 ];

    } catch (error) {

      throw (error)

    }

  }

  async getByUserName(username) {

    try {
      const user = await model
        .usermodel
        .findOne({ username: username });

      return user;

    } catch (error) {

      throw (error)

    }

  }

  async deleteById(id) {

    try {

      const isDeleted = await model
        .usermodel
        .deleteOne({ _id: id });

      return isDeleted;

    } catch (error) {

      throw (error)

    }

  }

  async getAllUsers() {

    try {

      const data = await model
        .usermodel
        .find();

      return data

    } catch (error) {

      throw (error)

    }

  }

  async getById(id) {

    try {

      const user = await model
        .usermodel
        .findById(id);

      return user;

    } catch (error) {

      if (error.kind === 'ObjectId') {
        let error = createError(400, 'Id incorrecta')
        throw error
    }

      throw (error)

    }
  }

  async updateUserPassword(data) {

    try {

      const passwordUpdated = await model
        .usermodel
        .updateOne({ _id: data._id }, { $set: data });
      return passwordUpdated;

    } catch (error) {

      throw (error)

    }

  }
  async updateUser(id, data) {

    try {

      const updatedUser = await model
        .usermodel
        .updateOne({ _id: id }, { $set: data });

      return updatedUser;

    } catch (error) {

      if (error.kind === 'ObjectId') {
        let error = createError(400, 'Id incorrecta')
        throw error
      }

      throw (error)

    }

  }
  async updateUserReserves(username, reserveData) {

    try {

      let reserveUpdated = await model
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
         
      return reserveUpdated;

    } catch (error) {

      throw (error)

    }

  }

  async deleteReserveById(username, reserveId) {

    try {

      let reserveDeleted = await model
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
      return reserveDeleted;

    } catch (error) {

      throw (error)

    }
  }

  static getInstance() {
    try {

      if (!instance) {

        instance = new UsersDAO();

        logger.info('Se ha creado una instancia de UsersDAO');

        return instance;
      }

      logger.info('Se ha utilizado una instancia ya creada de usersDAO');

      return instance;

    } catch (error) {

      throw (error)

    }

  }

}


