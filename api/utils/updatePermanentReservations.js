import * as model from '../models/court.js';
import logger from './logger.js';
import unidecode from 'unidecode';

const checkIfPermanentReservationsExist = (arr) => {
  const idToPermanent = new Map();

  for (const obj of arr) {
    if (obj.permanent) {
      if (idToPermanent.has(obj.id)) {
        idToPermanent.set(obj.id, true);
      } else {
        idToPermanent.set(obj.id, false);
      }
    }
  }

  for (const [id, permanent] of idToPermanent) {
    if (permanent) {
      let count = 0;

      for (const obj of arr) {
        if (obj.id === id && obj.permanent) {
          count++;
        }
      }

      if (count < 2) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
};



export const repeatPermanentReservations = async () => {
  try {

    const courts = await model.courtModel.find();

    for (const court of courts) {

      for (const [dayOfWeek, reserves] of Object.entries(court.unavailableDates)) {

        const isPermanentDuplicated = checkIfPermanentReservationsExist(reserves);

        if (reserves.length > 0) {

          if (!isPermanentDuplicated) {

            const updatedReserves = reserves
              .filter((reserve, index, arr) => {
                return arr.findIndex(obj => obj.id === reserve.id) === index;
              }).flatMap((reserve) => {

                if (reserve.permanent) {

                  const initialTime = typeof reserve.initialTime === 'string'
                    ? new Date(reserve.initialTime)
                    : new Date(reserve.initialTime);

                  const finalTime = typeof reserve.finalTime === 'string'
                    ? new Date(reserve.finalTime)
                    : new Date(reserve.finalTime);

                  const newInitialTime = new Date(initialTime.getTime() + 7 * 24 * 60 * 60 * 1000).getTime();

                  const newFinalTime = new Date(finalTime.getTime() + 7 * 24 * 60 * 60 * 1000).getTime();

                  const newReserve = {
                    ...reserve,
                    initialTime: newInitialTime,
                    finalTime: newFinalTime,
                    date: unidecode(new Date(newInitialTime).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'numeric' }))
                  };

                  return [reserve, newReserve];
                }

                return [reserve];
              });

            court.unavailableDates[dayOfWeek] = updatedReserves;

            const result = await model.courtModel.updateOne(
              { _id: court._id },
              { $set: { unavailableDates: court.unavailableDates } }
            );
            logger.info(result.modifiedCount + ' permanent reservations repeated for ' + court.name);
          }
        }
      }
    }
  } catch (error) {
    logger.error(error);
  }
};

