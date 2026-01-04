import { CustomError } from "../../../utils/customError.Utils.js";
export default class CourtServices {

    constructor(courtsDAO) {

        this.courtsDAO = courtsDAO;

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
                throw CustomError.notFound('the court does not exists');
            }

            return court

        } catch (error) {

            if (error.kind === 'ObjectId') {
                throw CustomError.badRequest('Id incorrecta')
            }

            throw (error)

        }
    }

    getUnavailableDatesByName = async (name) => {

        try {

            const unavalailableDates = await this.courtsDAO
                .getUnavailableDatesByName(name);

            if (!unavalailableDates) {
                throw CustomError.notFound('Theres no unavailable dates');
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

                throw CustomError.notFound(`Reserve with Id: ${reserveId} wasn't found`);

            }
            if (isReserveDeleted.modifiedCount === 0 && isReserveDeleted.matchedCount === 1) {

                throw CustomError.badRequest(`Reserve with Id: ${reserveId} wasn't modified`);

            }

            return isReserveDeleted


        } catch (error) {

            if (error.kind === 'ObjectId') {
                throw CustomError.badRequest('Id incorrecta')
            }

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
                if (reserveUpdated.matchedCount === 0) {

                    throw CustomError.notFound(`Usuario con el Id: ${id} no encontrado`)
    
                }

            return reserveUpdated

        } catch (error) {

            throw (error)

        }
    }

}