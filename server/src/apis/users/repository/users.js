import UserEntity from "../entities/user.js";


export default class UsersRepository {

  constructor(userDAO) {
    this.userDAO = userDAO
  }

  async register(data) {
    try {
      
      let newUser = await this.userDAO.register(data)
     
      return new UserEntity(newUser).datos();

    } catch (error) {

      throw (error)

    }

  }

  async getByUserName(username) {

    try {
      const user = await this.userDAO.getByUserName(username);
      
      return user ? new UserEntity(user).datos() : user;

    } catch (error) {

      throw (error)

    }

  }

  async deleteById(id) {

    try {

      const isDeleted = await this.userDAO
        .deleteById(id);

      return isDeleted;

    } catch (error) {

      throw (error)

    }

  }

  async getAllUsers() {

    try {

      const allUsers = await this.userDAO
        .getAllUsers();
      const allUsersEntities = allUsers.map(user => new UserEntity(user).datos())

      return allUsersEntities

    } catch (error) {

      throw (error)

    }

  }

  async getById(id) {

    try {

      const user = await this.userDAO
        .getById(id);

      return new UserEntity(user).datos();

    } catch (error) {

      throw (error)
    }
  }

  async updateUserPassword(data) {

    try {

      const passwordUpdated = await this.userDAO
        .updateUserPassword(data);
      return passwordUpdated;

    } catch (error) {

      throw (error)

    }

  }

  async updateUser(id, data) {

    try {

      const userUpdated = await this.userDAO
        .updateUser(id, data);

      return userUpdated

    } catch (error) {

      throw (error)

    }

  }

  async updateUserReserves(username, reserveData) {

    try {

      let reserveUpdated = await this.userDAO
        .updateUserReserves(username, reserveData);

      return reserveUpdated;

    } catch (error) {

      throw (error)

    }

  }

  async deleteReserveById(username, reserveId) {

    try {

      let reserveDeleted = await this.userDAO
        .deleteReserveById(username, reserveId);
      return reserveDeleted;

    } catch (error) {

      throw (error)

    }
  }

}


