import UserEntity from "../entities/user.js";

export default class UsersRepository {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async register(data) {
    let newUser = await this.userDAO.register(data);

    return new UserEntity(newUser).datos();
  }
  async getByUserName(username) {
    const user = await this.userDAO.getByUserName(username);
    return user ? new UserEntity(user).datos() : user;
  }
  async deleteById(id) {
    const isDeleted = await this.userDAO.deleteById(id);
    return isDeleted;
  }
  async getAllUsers() {
    const allUsers = await this.userDAO.getAllUsers();
    const allUsersEntities = allUsers.map((user) => new UserEntity(user).datos());
    return allUsersEntities;
  }
  async getById(id) {
    const user = await this.userDAO.getById(id);
    return new UserEntity(user).datos();
  }
  async updateUserPassword(data) {
    const passwordUpdated = await this.userDAO.updateUserPassword(data);
    return passwordUpdated;
  }
  async updateUser(id, data) {
    const userUpdated = await this.userDAO.updateUser(id, data);
    return userUpdated;
  }
  async updateUserReserves(username, reserveData) {
    let reserveUpdated = await this.userDAO.updateUserReserves(username, reserveData);
    return reserveUpdated;
  }
  async deleteReserveById(username, reserveId) {
    let reserveDeleted = await this.userDAO.deleteReserveById(username, reserveId);
    return reserveDeleted;
  }
}
