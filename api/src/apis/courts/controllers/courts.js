import CourtServices from "../services/courts.js";
import { routeLogger } from "../../../utils/logger.js";

export default class CourtsControllers {
    constructor() {
        this.courtsService = new CourtServices()
    }

    save = async (req, res) => {

        try {

            let data = await this.courtsService
                .save(req.body);

            res.json(data);

        } catch (error) {

            routeLogger(req, 'error', error);

        }
    }

    getAll = async (req, res) => {

        try {

            let data = await this.courtsService
                .getAll();

            res.json(data);

        } catch (error) {

            routeLogger(req, 'error', error);

        }
    }

    deleteCourtById = async (req, res) => {
        try {

            let data = await this.courtsService
                .deleteCourtById(req.params.id);
            data.deletedCount > 0
            ? res.json(true)
            : res.json(false)
            
            
        } catch (error) {

            routeLogger(req, 'error', error);
            
        }
    }

    getUnavailableDatesByName = async (req, res) => {
 
        try {
            let data = await this.courtsService.getUnavailableDatesByName(req.params.name);
            res.json(data);
        } catch (error) {
            routeLogger(req, 'error', error);
        }
    }

    reserveDate = async (req, res) => {
        
        try {
        
            let data = await this.courtsService
                .reserveDate(req.body);

            res.json(data);

        } catch (error) {

            routeLogger(req, 'error', error);

        }
    }

    deleteReserveById = async (req, res) => {
        try {
            
             let data = await this.courtsService
                .deleteReserveById(req.body.courtName, req.body.reserveDay, req.body.reserveId);
            
            res.json(data);
            
        } catch (error) {

            routeLogger(req, 'error', error);
            
        }
       
    }

    deleteUserReserves = async (req, res) => {
        try {

            let data = await this.courtsService
                .deleteUserReserves(req.body);
            
            res.json(data);
            
        } catch (error) {

            routeLogger(req, 'error', error);

        }
    }
    deleteOldReserves = async (req, res) => {
        try {

            let data = await this.courtsService
                .deleteOldReserves();
            
            res.json(data);
            
        } catch (error) {

            routeLogger(req, 'error', error);

        }
    }

    updateReservesUser = async (req, res) => {
        try {
          
            let data = await this.courtsService
                .updateReservesUser(req.body);
            
            res.json(data);
            
        } catch (error) {

            routeLogger(req, 'error', error);
            
        }

    }

}