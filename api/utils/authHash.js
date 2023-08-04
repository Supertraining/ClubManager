import bcrypt from 'bcrypt';
import logger from './logger.js';

export const authHash = async (password, usuario) => {

    try {
        console.log('AUTHHASH', password, usuario);
        const auth = bcrypt.compare(password, usuario.password);

        return auth;

    } catch (error) {

        logger.error(error);

    }

};