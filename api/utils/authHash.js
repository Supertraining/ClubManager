import bcrypt from 'bcrypt';
import logger from './logger.js';

export const authHash = async (password, usuario) => {

    try {

        const auth = bcrypt.compare(password, usuario.password);

        return auth;

    } catch (error) {

        logger.error(error);

    }

};