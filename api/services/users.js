import UsersDAO from "../DAOs/users.js";
import logger from "../utils/logger.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export default class UsersServices {

    constructor() {

        this.DAO = new UsersDAO();

    }

    async getByUserName(username) {

        try {

            const user = await this.DAO
                .getByUserName(username);

            if (user.length === 0) {

                logger.info(`No existe el usuario ${username}`);

                return false
            }

            return user[0];

        } catch (error) {

            logger.error(error);

        }

    }

    async insertUser(data) {

        try {

            if (!data.username || !data.password || !data.nombre || !data.apellido || !data.edad || 100 >= data.edad <= 0 || isNaN(data.edad) || !data.telefono) {

                return null

            }

            const newUser = await this.DAO
                .insertUser(

                    {
                        ...data,
                        password: bcrypt.hashSync(data.password,
                            bcrypt.genSaltSync(10))
                    }

                );

            return newUser[0];


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

    async updateUser(id, data) {

        try {

            const updateUser = await this.DAO
                .updateUser(id,
                    data
                );

            if (updateUser.matchedCount === 0) {

                logger.info(`El usuario con el Id: ${id} no encontrado`);

                return false

            }

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
