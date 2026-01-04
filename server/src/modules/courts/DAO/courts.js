import { Logger } from "../../../utils/logger.js";

let instance = null;
export default class CourtsDAO {

    constructor(courtModel, userModel) {

        this.courtModel = courtModel;
        this.userModel = userModel;

    }

    save = async (court) => {

        try {

            let data = await this.courtModel
                .create(court);

            return data;

        } catch (error) {

            throw (error)

        }

    }

    getAll = async () => {

        try {

            let data = await this.courtModel
                .find();

            return data;

        } catch (error) {

            throw (error)

        }
    }

    deleteCourtById = async (id) => {
        try {

            let data = await this.courtModel
                .deleteOne({ _id: id });

            return data;

        } catch (error) {

            throw (error)

        }
    }

    getUnavailableDatesByName = async (name) => {

        try {

            let data = await this.courtModel
                .findOne(
                    {
                        name: name
                    }
                );

            let unavailableDates = data.get('unavailableDates')

            return unavailableDates;

        } catch (error) {

            throw (error)

        }

    }

    reserveDate = async (reserve) => {

        try {

            let data = await this.courtModel
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
            throw (error)
        }
    }

    deleteReserveById = async (courtName, reserveDay, reserveId) => {

        try {

            let data = await this.courtModel
                .updateOne(
                    { name: courtName },
                    { $pull: { [ `unavailableDates.${reserveDay}` ]: { id: reserveId } } }
                );

            return data;

        } catch (error) {

            throw (error)

        }

    }

    deleteOldReserves = async () => {
        try {
            // Get yesterday's date
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            // Iterate over each court and remove reserves from yesterday
            const courts = await this.courtModel.find();
            for (const court of courts) {
                for (const [ dayOfWeek, reserves ] of Object.entries(court.unavailableDates)) {

                    court.unavailableDates[ dayOfWeek ] = reserves.filter((reserve) => {

                        return reserve.initialTime > yesterday.getTime()
                    });
                }

                const result = await this.courtModel.updateOne(
                    { _id: court._id },
                    { $set: { unavailableDates: court.unavailableDates } }
                );

                Logger.level().info(result.modifiedCount + ' reserves deleted from ' + court.name);
            }
            const users = await this.userModel.find();
            for (const user of users) {
                user.reserves = user.reserves.filter((reserve) => {
                    return reserve.initialTime > yesterday.getTime()
                })

                const userResult = await this.userModel.updateOne(
                    { _id: user._id },
                    { $set: { reserves: user.reserves } }
                )

                Logger.level().info(userResult.modifiedCount + ' reserves deleted from ' + user.username);

            }
        } catch (error) {
            throw (error)
        }
    }
    deleteUserReserves = async (user) => {

        try {

            const courts = await this.courtModel.find();
            for (const court of courts) {
                for (const [ dayOfWeek, reserves ] of Object.entries(court.unavailableDates)) {

                    court.unavailableDates[ dayOfWeek ] = reserves.filter((reserve) => {

                        return reserve.user != user.username
                    });
                }

                const result = await this.courtModel.updateOne(
                    { _id: court._id },
                    { $set: { unavailableDates: court.unavailableDates } }
                );

                Logger.level().info(result.modifiedCount + ' reserves deleted from ' + court.name);

                return result;
            }

        } catch (error) {
            throw (error)
        }
    }

    updateReservesUser = async (user) => {
        try {
            const courts = await this.courtModel.find();
            let reserveUpdated = false;

            for (const court of courts) {
                for (const [ dayOfWeek, reserves ] of Object.entries(court.unavailableDates)) {
                    for (const reserve of reserves) {
                        if (reserve.user == user.user) {
                            const result = await this.courtModel.updateOne(
                                { _id: court._id },
                                { $set: { [ `unavailableDates.${dayOfWeek}.$[elem].user` ]: user.newUser } },
                                { arrayFilters: [ { "elem.user": user.user } ] }
                            );

                            if (result.modifiedCount > 0) {
                                reserveUpdated = true;
                            }
                        }
                    }
                }
            }

            return reserveUpdated;

        } catch (error) {
            throw error;
        }
    };

    static getInstance(courtModel, userModel) {
        try {

            if (!instance) {

                instance = new CourtsDAO(courtModel, userModel);

                Logger.level().info('Se ha creado una instancia de CourtsDAO');

                return instance;
            }

            Logger.level().info('Se ha utilizado una instancia ya creada de CourtsDAO');

            return instance;

        } catch (error) {

            throw (error)

        }
    }

}



