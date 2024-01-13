import CourtsDAO from "../DAO/courts.js";
import createError from "../../../utils/createError.Utils.js";
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

            throw (error)

        }

    }

    getAll = async () => {

        try {

            let data = await this.courtsDAO
                .getAll();

            return data;

        } catch (error) {

            throw (error)

        }
    }

    deleteCourtById = async (id) => {
        try {

            const isCourtDeleted = await this.courtsDAO
                .deleteCourtById(id);

            if (isCourtDeleted.deletedCount === 0) {
                let error = createError(404, 'the court does not exists');
                throw error;
            }


            return court

        } catch (error) {

            throw (error)

        }
    }

    getUnavailableDatesByName = async (name) => {

        try {

            const unavalailableDates = await this.courtsDAO
                .getUnavailableDatesByName(name);

            if (!unavalailableDates) {
                let error = createError(404, 'Theres no unavailable dates');
                throw error;
            }

            return unavalailableDates;

        } catch (error) {

            throw (error)

        }

    }

    reserveDate = async (reserve) => {

        try {

            let data = await this.courtsDAO
                .reserveDate(reserve);

            return data

        } catch (error) {

            throw (error)

        }
    }

    deleteReserveById = async (courtName, reserveDay, reserveId) => {
        try {

            const isReserveDeleted = await this.courtsDAO
                .deleteReserveById(courtName, reserveDay, reserveId);

            if (isReserveDeleted.matchedCount === 0) {

                let error = createError(404, `Reserve with Id: ${id} wasn't found`);

                throw error

            }
            if (isReserveDeleted.modifiedCount === 0 && isReserveDeleted.matchedCount === 1) {

                let error = createError(400, `Reserve with Id: ${id} wasn't modified`);

                throw error

            }

            return isReserveDeleted


        } catch (error) {

            throw (error)


        }

    }

    deleteOldReserves = async () => {
        try {

            let data = await this.courtsDAO
                .deleteOldReserves();

            return data;

        } catch (error) {

            throw (error)

        }
    }

    deleteUserReserves = async (user) => {
        try {
            
            let data = await this.courtsDAO
                .deleteUserReserves(user);
          
            return data;

        } catch (error) {

            throw (error)

        }
    }

    updateReservesUser = async (user) => {
        try {

            const reserveUpdated = await this.courtsDAO
                .updateReservesUser(user);
               
            return reserveUpdated

        } catch (error) {

            throw (error)

        }
    }

}