import UsersDAO from "../DAO/users.js";
import { emailNewUserNotification, emailUpdatePasswordNotification } from "../../../utils/emailNotifications.Utils.js";
import logger from "../../../utils/logger.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secretKey } from "../../../config/config.js";
import createError from '../../../utils/createError.Utils.js'

export default class UsersServices {

    constructor() {

        this.DAO = UsersDAO.getInstance();

    }
    async register(data) {
        try {

            const checkUser = await this.getByUserName(data.username);

            if (checkUser) {
                let error = createError(400, 'El usuario ya esta registrado');
                throw (error)
            };

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

            throw (error);

        }

    }

    async login(data) {
        try {

            const user = await this.getByUserName(data.username);

            const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
            if (!isPasswordCorrect) {
                let error = createError(404, 'Contraseña incorrecta');
                throw error;
            };

            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, secretKey, { expiresIn: '1h' });

            return { user: user, token: token };

        } catch (error) {
            throw (error);
        }
    };
    async getByUserName(username) {

        try {

            const user = await this.DAO
                .getByUserName(username);

            if (!user) {
                let error = createError(404, 'El usuario no existe');
                throw error;
            }

            return user;

        } catch (error) {

            throw (error);

        }

    }

    async deleteById(id) {

        try {

            const isDeleted = await this.DAO
                .deleteById(id);

            if (isDeleted.deletedCount === 0) {
                let error = createError(404, 'El usuario no existe');
                throw error;
            }

            return true

        } catch (error) {

            if (error.kind === 'ObjectId') {
                let error = createError(400, 'Id incorrecta')
                throw error
            }

            throw (error)

        }

    }

    async getAllUsers() {

        try {

            const data = await this.DAO
                .getAllUsers();

            return data;

        } catch (error) {

            throw (error)

        }

    }

    async getById(id) {

        try {
            const user = await this.DAO
                .getById(id);

            if (!user) {
                let error = createError(404, 'El usuario no existe');
                throw error;
            }

            return user
        }
        catch (error) {

            if (error.kind === 'ObjectId') {
                let error = createError(400, 'Id incorrecta')
                throw error
            }

            throw (error)

        }
    }

    async updateUserPassword(data) {

        try {

            const passwordUpdated = await this.DAO
                .updateUserPassword({
                    ...data,
                    password: bcrypt.hashSync(data.password,
                        bcrypt.genSaltSync(10))
                });

            if (passwordUpdated.matchedCount === 0) {

                let error = createError(404, `Usuario con el Id: ${id} no encontrado`);

                throw error

            }
            if (passwordUpdated.modifiedCount === 0 && passwordUpdated.matchedCount === 1) {

                let error = createError(400, `Usuario con el Id: ${id} no ha sido modificado`);

                throw error

            }

            emailUpdatePasswordNotification(data);
            const updatedUser = await this.DAO
                .getById(data._id);

            return updatedUser

        } catch (error) {

            throw (error)

        }

    }
    async updateUser(id, data) {

        try {

            const userUpdated = await this.DAO
                .updateUser(id, data);

            if (userUpdated.matchedCount === 0) {

                let error = createError(404, `Usuario con el Id: ${id} no encontrado`);

                throw error

            }
            if (userUpdated.modifiedCount === 0 && userUpdated.matchedCount === 1) {

                let error = createError(400, `Usuario con el Id: ${id} no ha sido modificado`);

                throw error

            }

            const updatedUser = await this.DAO
                .getById(id);

            return updatedUser

        } catch (error) {

            throw (error)

        }

    }
    async updateUserReserves(username, reserveData) {

        try {
            const reserveUpdated = await this.DAO
                .updateUserReserves(username, reserveData);

            if (reserveUpdated.matchedCount === 0) {

                let error = createError(404, `Usuario con el Id: ${id} no encontrado`);

                throw error

            }
            if (reserveUpdated.modifiedCount === 0 && reserveUpdated.matchedCount === 1) {

                let error = createError(400, `Usuario con el Id: ${id} no ha sido modificado`);

                throw error

            }

            const updatedUser = await this.DAO
                .getByUserName(username);

            return updatedUser;

        } catch (error) {

            throw (error)

        }

    }

    async deleteReserveById(username, reserveId) {

        try {

            let reserveDeleted = await this.DAO.
                deleteReserveById(username, reserveId);

            if (reserveDeleted.matchedCount === 0) {

                let error = createError(404, `La reserva con el Id: ${reserveId} no encontrada`);

                throw error

            }
            if (reserveDeleted.modifiedCount === 0 && reserveDeleted.matchedCount === 1) {

                let error = createError(400, `La reserva con el Id: ${reserveId} no ha sido modificado`);

                throw error

            }

            return reserveDeleted;

        } catch (error) {
            throw error
        }
    }

}
