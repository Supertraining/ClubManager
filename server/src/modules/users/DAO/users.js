import { Logger } from "../../../utils/logger.js";

let instance = null;

export default class UsersDAO {
  constructor(userModel) {
    this.model = userModel;
  }

  async register(data) {
    let newUser = await this.model.create(data);

    newUser.save();
    return newUser;
  }

  async getByUserName(username) {
    const user = await this.model.findOne({ username: username });
    return user;
  }

  async deleteById(id) {
    const isDeleted = await this.model.deleteOne({ _id: id });

    return isDeleted;
  }

  async getAllUsers() {
    const data = await this.model.find();
    return data;
  }

  async getById(id) {
    const user = await this.model.findById(id);
    return user;
  }

  async updateUserPassword(data) {
    const passwordUpdated = await this.model.updateOne({ _id: data._id }, { $set: data });
    return passwordUpdated;
  }

  async updateUser(id, data) {
    const updatedUser = await this.model.updateOne({ _id: id }, { $set: data });
    return updatedUser;
  }

  async updateUserReserves(username, reserveData) {
    let reserveUpdated = await this.model.updateOne(
      {
        username: username,
      },
      {
        $push: {
          [`reserves`]: reserveData,
        },
      }
    );

    return reserveUpdated;
  }

  async deleteReserveById(username, reserveId) {
    let reserveDeleted = await this.model.updateOne(
      {
        username: username,
      },
      {
        $pull: {
          [`reserves`]: { id: reserveId },
        },
      }
    );
    return reserveDeleted;
  }

  static getInstance(userModel) {
    if (!instance) {
      instance = new UsersDAO(userModel);

      Logger.level().info("Se ha creado una instancia de UsersDAO");

      return instance;
    }

    Logger.level().info("Se ha utilizado una instancia ya creada de usersDAO");

    return instance;
  }
}
