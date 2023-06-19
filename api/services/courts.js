import CourtsDAO from "../DAOs/courts.js";
import logger from "../utils/logger.js";

export default class CourtServices {

    constructor() {

        this.courtsDAO = new CourtsDAO();

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

            console.log(error);

            
        }
        
    }

    deleteOldReserves = async () => {
        try {

            let data = await this.courtsDAO
                .deleteOldReserves();
            
            return data;
            
        } catch (error) {
            
            console.log(error)

        }
    }

}