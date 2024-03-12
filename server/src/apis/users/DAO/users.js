import { Logger } from "../../../utils/logger.js";

let instance = null;

export default class UsersDAO {

  constructor(userModel) {
    this.model = userModel
  }

  async register(data) {
    try {

      let newUser = await this.model.create(data)

      newUser.save()
      return newUser;

    } catch (error) {

      throw (error)

    }

  }

  async getByUserName(username) {

    try {
      const user = await this.model
        .findOne({ username: username });
      return user;

    } catch (error) {

      throw (error)

    }

  }

  async deleteById(id) {

    try {

      const isDeleted = await this.model
        .deleteOne({ _id: id });

      return isDeleted;

    } catch (error) {

      throw (error)

    }

  }

  async getAllUsers() {

    try {

      const data = await this.model
        .find();

      return data

    } catch (error) {

      throw (error)

    }

  }

  async getById(id) {

    try {

      const user = await this.model
        .findById(id);

      return user;

    } catch (error) {

      throw (error)
    }
  }

  async updateUserPassword(data) {

    try {

      const passwordUpdated = await this.model
        .updateOne({ _id: data._id }, { $set: data });
      return passwordUpdated;

    } catch (error) {

      throw (error)

    }

  }
  
  async updateUser(id, data) {
    try {

      const updatedUser = await this.model
        .updateOne({ _id: id }, { $set: data });
    
      return updatedUser;

    } catch (error) {

      throw (error)

    }

  }

  async updateUserReserves(username, reserveData) {

    try {

      let reserveUpdated = await this.model
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

      let reserveDeleted = await this.model
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

  static getInstance(userModel) {
    try {

      if (!instance) {

        instance = new UsersDAO(userModel);

       Logger.level().info('Se ha creado una instancia de UsersDAO');

        return instance;
      }

      Logger.level().info('Se ha utilizado una instancia ya creada de usersDAO');

      return instance;

    } catch (error) {

      throw (error)

    }

  }

}


