import { CustomError } from '../utils/customError.Utils.js';
import { TokenHandler } from '../utils/tokenHandler.Utils.js';


export class IsAuthenticated {

    static checkJwt = async (req, res, next) => {
        try {
            const bearerJwt = req.headers.authorization;
            const jwtByUser = bearerJwt?.split(' ').pop();
            const isUser = await TokenHandler.validateToken(jwtByUser);
            if (!isUser) throw CustomError.unauthorized('NOT AUTHORIZED')
            req.user = isUser
            next()
        } catch (error) {
            if (error instanceof CustomError) {
                next(error) 
                return;
            }
            next(CustomError.internalError()) 
        }
    }
}
