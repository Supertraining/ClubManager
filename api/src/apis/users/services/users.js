import UsersDAO from "../DAO/users.js";
import { emailNewUserNotification, emailUpdatePasswordNotification } from "../../../utils/emailNotifications.js";
import logger from "../../../utils/logger.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secretKey } from "../../../config/config.js";

export default class UsersServices {

    constructor() {

        this.DAO = UsersDAO.getInstance();

    }
    async register(data) {
        try {

            const checkUser = await this.getByUserName(data.username);

            if (checkUser) return false;

            const newUser = await this.DAO
                .register(

                    {
                        ...data,
                        password: bcrypt.hashSync(data.password,
                            bcrypt.genSaltSync(10)),
                        admin: data.admin || false
                    }

                );
            newUser && emailNewUserNotification(data.username, data);
            return newUser;


        } catch (error) {

            logger.error(error);

        }

    }

    async login(data) {
        try {

            const user = await this.getByUserName(data.username);
            if (!user)
                return { message: 'user not found', user: user };

            const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
            if (!isPasswordCorrect)
                return { message: 'Wrong password or username', pass: isPasswordCorrect, user: user.username };

            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, secretKey, { expiresIn: '1h' });

            return { user: user, token: token };

        } catch (error) {

            logger.error(error);

        }
    };
    async getByUserName(username) {

        try {

            const user = await this.DAO
                .getByUserName(username);

            if (!user) {

                return null

            }

            return user;

        } catch (error) {

            logger.error(error);

        }

    }

    async deleteById(id) {

        try {

            const data = await this.DAO
                .deleteById(id);

            if (data.deletedCount === 0) {

                logger.info(`El Usuario con el Id: ${id} no existe`);

                return false

            }

            logger.info('Usuario eliminado con exito');

            return true

        } catch (err) {

            logger.error(err);

        }

    }

    async getAllUsers() {

        try {

            const data = await this.DAO
                .getAllUsers();

            if (data.length === 0) {

                logger.info('No hay usuarios registrados');

                return data

            }

            return data;

        } catch (err) {

            logger.error(err);

        }

    }

    async getById(id) {

        try {
            const data = await this.DAO
                .getById(id);

            if (!data) {

                logger.info(`El usuario con el Id: ${id} no existe`);

                return null

            }

            return data
        }
        catch (err) {

            logger.error(err);

        }
    }

    async updateUserPassword(data) {

        try {

            const updateUser = await this.DAO
                .updateUserPassword({
                    ...data,
                    password: bcrypt.hashSync(data.password,
                        bcrypt.genSaltSync(10))
                });

            if (updateUser)
                emailUpdatePasswordNotification(data);
            const updatedUser = await this.DAO
                .getById(data._id);

            return updatedUser

        } catch (err) {

            logger.error(err);

        }

    }
    async updateUser(id, data) {

        try {

            const updateUser = await this.DAO
                .updateUser(id, data);

            const updatedUser = await this.DAO
                .getById(id);

            return updatedUser

        } catch (err) {

            logger.error(err);

        }

    }
    async updateUserReserves(username, reserveData) {

        try {
            const updateUser = await this.DAO
                .updateUserReserves(username, reserveData);

            if (updateUser.matchedCount === 0) {

                logger.info(`El usuario con el Id: ${id} no encontrado`);

                return null;

            }

            const updatedUser = await this.DAO
                .getByUserName(username);

            return updatedUser;

        } catch (err) {

            logger.error(err);

        }

    }

    async deleteReserveById(username, reserveId) {

        try {

            let deletedReserve = await this.DAO.
                deleteReserveById(username, reserveId);

            return deletedReserve;

        } catch (error) {

        }
    }

}
