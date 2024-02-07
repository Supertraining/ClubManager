export default class CourtsControllers {
    constructor(courtServices) {
        this.courtsService = courtServices;
    }

    save = async (req, res, next) => {

        try {

            let data = await this.courtsService
                .save(req.body);

            res.json(data);

        } catch (error) {

            next(error)

        }
    }

    getAll = async (req, res, next) => {

        try {

            let data = await this.courtsService
                .getAll();

            res.json(data);

        } catch (error) {

            next(error)

        }
    }

    deleteCourtById = async (req, res, next) => {
        try {

            let data = await this.courtsService
                .deleteCourtById(req.params.id);
            data.deletedCount > 0
                ? res.json(true)
                : res.json(false)


        } catch (error) {

            next(error)

        }
    }

    getUnavailableDatesByName = async (req, res, next) => {

        try {
            let data = await this.courtsService.getUnavailableDatesByName(req.params.name);
            res.json(data);
        } catch (error) {
            next(error)
        }
    }

    reserveDate = async (req, res, next) => {

        try {

            let data = await this.courtsService
                .reserveDate(req.body);

            res.json(data);

        } catch (error) {

            next(error)

        }
    }

    deleteReserveById = async (req, res, next) => {
        try {

            let data = await this.courtsService
                .deleteReserveById(req.body.courtName, req.body.reserveDay, req.body.reserveId);

            res.json(data);

        } catch (error) {

            next(error)

        }

    }

    deleteUserReserves = async (req, res, next) => {
        try {

            let data = await this.courtsService
                .deleteUserReserves(req.body);

            res.json(data);

        } catch (error) {

            next(error)

        }
    }
    deleteOldReserves = async (req, res, next) => {
        try {

            let data = await this.courtsService
                .deleteOldReserves();

            res.json(data);

        } catch (error) {

            next(error)

        }
    }

    updateReservesUser = async (req, res, next) => {
        try {

            const reserveUpdated = await this.courtsService
                .updateReservesUser(req.body);

            res.json(reserveUpdated);

        } catch (error) {

            next(error)

        }

    }

}