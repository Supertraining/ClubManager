import CourtServices from "../services/courts.js";


export default class CourtsControllers {
    constructor() {
        this.courtsService = new CourtServices()
    }

    save = async (req, res) => {

        try {

            let data = await this.courtsService
                .save(req.body);

            res.json(data);

        } catch (err) {

            console.log(err);

        }
    }

    getAll = async (req, res) => {

        try {

            let data = await this.courtsService
                .getAll();

            res.json(data);

        } catch (err) {

            console.log(err);

        }
    }

    getUnavailableDatesByName = async (req, res) => {
        try {
            let data = await this.courtsService.getUnavailableDatesByName(req.params.name);
            res.json(data);
        } catch (err) {
            console.log(err);
        }
    }

    reserveDate = async (req, res) => {

        try {

            let data = await this.courtsService
                .reserveDate(req.body);

            res.json(data);

        } catch (err) {

            console.log(err);

        }
    }
}