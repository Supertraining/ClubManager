import * as model from '../models/court.js';

let instance = null;
export default class CourtsDAO {

    save = async (court) => {

        try {

            let data = await model
                .courtModel
                .create(court);

            return data;

        } catch (err) {

            console.log(err);

        }

    }

    getAll = async () => {

        try {

            let data = await model
                .courtModel
                .find();

            return data;

        } catch (err) {

            console.log(err);

        }
    }

    getUnavailableDatesByName = async (name) => {

        try {

            let data = await model
                .courtModel
                .findOne(
                    {
                        name: name
                    }
                );

            let unavailableDates = data.get('unavailableDates')

            return unavailableDates;

        } catch (err) {

            console.log(err);

        }

    }

    reserveDate = async (reserve) => {

        try {

            let data = await model
                .courtModel
                .updateOne(
                    {
                        name: reserve.name
                    },
                    {
                        $push:
                        {

                            [`unavailableDates.${reserve.selectedDates.weekday}`]: reserve.selectedDates,

                        }
                    }
                );

            return data;

        } catch (err) {
            console.log(err);
        }
    }

    deleteReserveById = async (courtName, reserveDay, reserveId) => {

        try {

            let data = await model.courtModel
                .updateOne(
                    { name: courtName }, // Update criteria
                    { $pull: { [`unavailableDates.${reserveDay}`]: { id: reserveId } } }
                );

            return data;

        } catch (err) {

            console.log(err);

        }

    }

    deleteOldReserves = async () => {
        try {
            // Get yesterday's date
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            // Iterate over each court and remove reserves from yesterday
            const courts = await model.courtModel.find();
            for (const court of courts) {
                for (const [dayOfWeek, reserves] of Object.entries(court.unavailableDates)) {
                    court.unavailableDates[dayOfWeek] = reserves.filter((reserve) => {
                        return reserve.initialTime > yesterday.getTime();
                    });
                }
                const result = await model.courtModel.updateOne(
                    { _id: court._id },
                    { $set: { unavailableDates: court.unavailableDates } }
                );
                return (result.modifiedCount + ' reserves deleted from ' + court.name);
            }
        } catch (err) {
            console.log(err);
        }
    }


    updateById = async (id, newData) => {
        try {

            let data = await model
                .courtModel
                .findByIdAndUpdate(id, newData);

            return data;

        } catch (err) {

            console.log(err);

        }
    }


}



