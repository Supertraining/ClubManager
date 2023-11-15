import CourtsDAO from "../DAO/courts.js";
import logger from "../../../utils/logger.js";

export default class CourtServices {

    constructor() {

        this.courtsDAO = CourtsDAO.getInstance();

    }

    save = async (court) => {

        try {

            let data = await this.courtsDAO
                .save(court);
            
            return data;

        } catch (error) {

            logger.error(error);

        }

    }

    getAll = async () => {

        try {

            let data = await this.courtsDAO
                .getAll();
            
            return data;

        } catch (error) {

            logger.error(error);

        }
    }

    deleteCourtById = async (id) => {
        try {
            
            let data = await this.courtsDAO
                .deleteCourtById(id)

            return data

        } catch (error) {

            logger.error(error)
            
        }
    }

    getUnavailableDatesByName = async (name) => {

        try {
            
            let data = await this.courtsDAO
                .getUnavailableDatesByName(name);

            return data
             
        } catch (error) {

            logger.error(error);

        }

    }

    reserveDate = async (reserve) => {
       
        try {
            
            let data = await this.courtsDAO
                .reserveDate(reserve);

            return data

        } catch (error) {

            logger.error(error);
            
        }
    }

    deleteReserveById = async (courtName, reserveDay, reserveId) => {
        try {

           let data = await this.courtsDAO
                .deleteReserveById(courtName, reserveDay, reserveId); 
            
            return data

        } catch (error) {

            logger.log(error);

            
        }
        
    }

    deleteOldReserves = async () => {
        try {

            let data = await this.courtsDAO
                .deleteOldReserves();
            
            return data;
            
        } catch (error) {
            
            logger.log(error)

        }
    }
    
    deleteUserReserves = async (user) => {
        try {

            let data = await this.courtsDAO
                .deleteUserReserves(user);
            
            return data;
            
        } catch (error) {
            
            logger.log(error)

        }
    }

    updateReservesUser = async (user) => {
        try {
            
            let data = await this.courtsDAO
                .updateReservesUser(user);
            
            return data
            
        } catch (error) {

            logger.error(error);
            
        }
    }

}