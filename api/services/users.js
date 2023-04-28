import UsersRepo from "../repo/users.js";
import logger from "../utils/logger.js";
import bcrypt from 'bcrypt';

export default class UsersServices {

    constructor() {

        this.repo = new UsersRepo();

    }

    async getByUserName(username) {
           
        try {

            const user = await this.repo
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
           
            if (!data.username || !data.password || !data.nombre  || !data.apellido || !data.edad || 100 >= data.edad <= 0 || isNaN(data.edad) || !data.telefono) {
                
                return null
                
            }
            
            const newUser = await this.repo
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

            const data = await this.repo
                .deleteById(id);

            if (data.deletedCount === 0) {

                logger.info(`El Usuario con el Id: ${id} no existe`);

                return {
                    message: `El Usuario con el Id: ${id} no existe`,
                    data: null
                }
            }

            logger.info('Usuario eliminado con exito');

            return {
                message: `Usuario ${id} eliminado con exito`,
                data: data
            };

        } catch (err) {

            logger.error(err);

        }

    }

    async getAllUsers() {

        try {

            const data = await this.repo
                .getAllUsers();

            if (data.length === 0) {

                logger.info('No hay usuarios registrados');

                return {
                    message: 'No hay usuarios registrados',
                    users: data
                }
            }

            return data;

        } catch (err) {

            logger.error(err);

        }

    }

    async getById(id) {
      
        try {
            const data = await this.repo
                .getById(id);
            
            if (!data) {
                
                logger.info(`El usuario con el Id: ${id} no existe`);

                return {

                    message: `El usuario con el Id: ${id} no existe`,
                    data: null

                }
            }

            return {

                data: data

            };
        }
        catch (err) {
            
            logger.error(err);

        }
    }

    async updateUser(id, data) {

        try {
     
            const updateUser = await this.repo
                .updateUser(id,
                    {
                        ...data,
                        password: bcrypt.hashSync(data.password, bcrypt.genSaltSync(10))
                    }
                );
           
            if (updateUser.matchedCount === 0) {

                logger.info(`El usuario con el Id: ${id} no encontrado`);

                return {
                    message: `El usuario con el Id: ${id} no encontrado`,
                    data: null
                };

            }

            const updatedUser = await this.repo
                .getById(id);
            
            return {
                message: `Usuario ${id} actualizado con exito`,
                data: updatedUser
            };

        } catch (err) {

            logger.error(err);

        }

    }

}
