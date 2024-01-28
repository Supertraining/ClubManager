import UsersDAO from "../DAO/users.js";
import { emailNewUserNotification, emailUpdatePasswordNotification } from "../../../utils/emailNotifications.Utils.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secretKey } from "../../../config/config.js";
import { CustomError } from "../../../utils/customError.Utils.js";

export default class UsersServices {

    constructor() {

        this.DAO = UsersDAO.getInstance();

    }
    async register(data) {
        try {

            const checkUser = await this.getByUserName(data.username);

            if (checkUser) {
                throw CustomError.badRequest('El usuario ya esta registrado');
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

            if (!user) {
                throw CustomError.notFound('El usuario no existe');
            }

            const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
            if (!isPasswordCorrect) {
                throw CustomError.badRequest('El usuario ya esta registrado');
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
                throw CustomError.notFound('El usuarios no existe');
            }

            return true

        } catch (error) {

            if (error.kind === 'ObjectId') {
                throw CustomError.badRequest('Id incorrecta')

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

                throw CustomError.notFound('El usuarios no existe');

            }

            return user
        }
        catch (error) {

            if (error.kind === 'ObjectId') {
                throw CustomError.badRequest('Id incorrecta')
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

                throw CustomError.notFound(`Usuario con el Id: ${id} no encontrado`)

            }
            if (passwordUpdated.modifiedCount === 0 && passwordUpdated.matchedCount === 1) {

                throw CustomError.badRequest(`Usuario con el Id: ${id} no ha sido modificado`)

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

                throw CustomError.notFound(`Usuario con el Id: ${id} no encontrado`)

            }
            if (userUpdated.modifiedCount === 0 && userUpdated.matchedCount === 1) {

                throw CustomError.badRequest(`Usuario con el Id: ${id} no ha sido modificado`)

            }

            const updatedUser = await this.DAO
                .getById(id);

            return updatedUser

        } catch (error) {
            
            if (error.kind === 'ObjectId') {
                throw CustomError.badRequest('Id incorrecta')
            }

            throw (error)

        }

    }
    async updateUserReserves(username, reserveData) {

        try {
            const reserveUpdated = await this.DAO
                .updateUserReserves(username, reserveData);

            if (reserveUpdated.matchedCount === 0) {

                throw CustomError.notFound(`Usuario con el Id: ${id} no encontrado`)

            }
            if (reserveUpdated.modifiedCount === 0 && reserveUpdated.matchedCount === 1) {

                throw CustomError.badRequest(`Usuario con el Id: ${id} no ha sido modificado`)

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

                throw CustomError.notFound(`La reserva con el Id: ${reserveId} no encontrada`)

            }
            if (reserveDeleted.modifiedCount === 0 && reserveDeleted.matchedCount === 1) {

                throw CustomError.badRequest(`La reserva con el Id: ${reserveId} no ha sido modificado`)

            }

            return reserveDeleted;

        } catch (error) {
            throw error
        }
    }

}
