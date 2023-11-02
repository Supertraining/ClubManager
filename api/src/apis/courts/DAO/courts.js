import * as model from '../../../models/court.js';
import { usermodel } from '../../../models/user.js';
import logger from '../../../utils/logger.js';

let instance = null;
export default class CourtsDAO {

    save = async (court) => {

        try {

            let data = await model
                .courtModel
                .create(court);

            return data;

        } catch (error) {

            logger.error(error);

        }

    }

    getAll = async () => {

        try {

            let data = await model
                .courtModel
                .find();

            return data;

        } catch (error) {

            logger.error(error);

        }
    }

    deleteCourtById = async (id) => {
        try {

            let data = await model
                .courtModel
                .deleteOne({ _id: id });

            return data;

        } catch (error) {

            logger.error(error);

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

        } catch (error) {

            logger.error(error);

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

                            [ `unavailableDates.${reserve.selectedDates.weekday}` ]: reserve.selectedDates,

                        }
                    }
                );

            return data;

        } catch (error) {
            logger.error(error);
        }
    }

    deleteReserveById = async (courtName, reserveDay, reserveId) => {

        try {

            let data = await model.courtModel
                .updateOne(
                    { name: courtName },
                    { $pull: { [ `unavailableDates.${reserveDay}` ]: { id: reserveId } } }
                );

            return data;

        } catch (error) {

            logger.error(error);

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
                for (const [ dayOfWeek, reserves ] of Object.entries(court.unavailableDates)) {

                    court.unavailableDates[ dayOfWeek ] = reserves.filter((reserve) => {

                        return reserve.initialTime > yesterday.getTime()
                    });
                }

                const result = await model.courtModel.updateOne(
                    { _id: court._id },
                    { $set: { unavailableDates: court.unavailableDates } }
                );

                logger.info(result.modifiedCount + ' reserves deleted from ' + court.name);
            }
            const users = await usermodel.find();
            for (const user of users) {
                user.reserves = user.reserves.filter((reserve) => {
                    return reserve.initialTime > yesterday.getTime()
                })

                const userResult = await usermodel.updateOne(
                    { _id: user._id },
                    { $set: { reserves: user.reserves } }
                )

                logger.info(userResult.modifiedCount + ' reserves deleted from ' + user.username);

            }
        } catch (error) {
            logger.error(error);
        }
    }
    deleteUserReserves = async (user) => {

        try {

            const courts = await model.courtModel.find();
            for (const court of courts) {
                for (const [ dayOfWeek, reserves ] of Object.entries(court.unavailableDates)) {

                    court.unavailableDates[ dayOfWeek ] = reserves.filter((reserve) => {

                        return reserve.user != user.username
                    });
                }

                const result = await model.courtModel.updateOne(
                    { _id: court._id },
                    { $set: { unavailableDates: court.unavailableDates } }
                );

                logger.info(result.modifiedCount + ' reserves deleted from ' + court.name);
            }

        } catch (error) {
            logger.error(error);
        }
    }

    updateReservesUser = async (user) => {

        try {

            const courts = await model.courtModel.find();
            for (const court of courts) {
                for (const [ dayOfWeek, reserves ] of Object.entries(court.unavailableDates)) {

                    court.unavailableDates[ dayOfWeek ].forEach(async (reserve) => {
                        if (reserve.user == user.user) {

                            await model.courtModel.updateOne(
                                { _id: court._id },
                                { $set: { [ `unavailableDates.${dayOfWeek}.$[elem].user` ]: user.newUser } },
                                { arrayFilters: [ { "elem.user": user.user } ] }
                            );

                        }
                    })

                }

            }

        } catch (error) {
            logger.error(error);
        }
    }

    static getInstance() {
        try {

            if (!instance) {

                instance = new CourtsDAO();

                logger.info('Se ha creado una instancia de CourtsDAO');

            }

            logger.info('Se ha utilizado una instancia ya creada de CourtsDAO');

            return instance;

        } catch (error) {

            logger.error(error);

        }
    }

}



