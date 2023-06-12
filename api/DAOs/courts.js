import * as model from '../models/court.js';
import logger from '../utils/logger.js';

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

                            [`unavailableDates.${reserve.selectedDates.weekday}`]: reserve.selectedDates,

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
                    { $pull: { [`unavailableDates.${reserveDay}`]: { id: reserveId } } }
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
                for (const [dayOfWeek, reserves] of Object.entries(court.unavailableDates)) {
                    
                    court.unavailableDates[dayOfWeek] = reserves.filter((reserve) => {
                       console.log('filter:', !reserve.permanent) 
                        return (reserve.permanent) || (reserve.initialTime > yesterday.getTime())
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

    updateById = async (id, newData) => {
        try {

            let data = await model
                .courtModel
                .findByIdAndUpdate(id, newData);

            return data;

        } catch (error) {

            logger.error(error);

        }
    }


}



