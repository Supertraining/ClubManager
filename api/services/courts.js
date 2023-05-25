import CourtsDAO from "../DAOs/courts.js";
import { v4 as uuidv4 } from 'uuid';

export default class CourtServices {

    constructor() {

        this.courtsDAO = new CourtsDAO();

    }

    save = async (court) => {

        try {

            let data = await this.courtsDAO
                .save(court);
            
            return data;

        } catch (err) {

            console.log(err);

        }

    }

    getAll = async () => {

        try {

            let data = await this.courtsDAO
                .getAll();
            
            return data;

        } catch (err) {

            console.log(err);

        }
    }

    getUnavailableDatesByName = async (name) => {

        try {
            
            let data = await this.courtsDAO
                .getUnavailableDatesByName(name);

            return data
             
        } catch (err) {

            console.log(err);

        }

    }

    reserveDate = async (reserve) => {
       
        try {
            
            let data = await this.courtsDAO
                .reserveDate(reserve);

            return data

        } catch (err) {

            console.log(err);
            
        }
    }

    deleteReserveById = async (courtName, reserveDay, reserveId) => {
        try {

           let data = await this.courtsDAO
                .deleteReserveById(courtName, reserveDay, reserveId); 
            
            return data

        } catch (error) {

            console.log(err);

            
        }
        
    }

}