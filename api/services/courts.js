import CourtsDAO from "../DAOs/courts.js";

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

            let reserveData;
            let weekDay = (new Date(reserve.selectedDates.initialTime).getDay())
            switch (weekDay) {
                case 0: reserveData = { ...reserve, day: 'Domingo' }
                    break;
                case 1: reserveData = { ...reserve, day: 'Lunes' }
                    break;
                case 2: reserveData = { ...reserve, day: 'Martes' }
                    break;
                case 3: reserveData = { ...reserve, day: 'Miercoles' }
                    break;
                case 4: reserveData = { ...reserve, day: 'Jueves' }
                    break;
                case 5: reserveData = { ...reserve, day: 'Viernes' }
                    break;
                case 6: reserveData = { ...reserve, day: 'Sabado' }
                    break;
                
            }
         
            let data = await this.courtsDAO
                .reserveDate(reserveData);

            return data

        } catch (err) {

            console.log(err);
            
        }
    }

}