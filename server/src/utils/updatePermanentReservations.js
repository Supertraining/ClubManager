import * as model from '../models/court.js';
import logger from './logger.js';
import unidecode from 'unidecode';

const checkIfPermanentReservationsExist = (reserves) => {

  const idToPermanent = new Map();

  const today = new Date().setHours(0, 0, 0, 0);

  for (const reserve of reserves) {

    if (reserve.permanent) {

      if (idToPermanent.has(reserve.id)) {
        idToPermanent.set(reserve.id, true);
      } else {
        idToPermanent.set(reserve.id, false);
      }
    }

  }

  for (const [ id, permanent ] of idToPermanent) {

    if (permanent) {

      let count = 0;
      const permReserves = [];
      for (const obj of reserves) {

        const reserveDate = new Date(obj.initialTime).setHours(0, 0, 0, 0);

        if ((obj.id === id) && obj.permanent && (reserveDate > today)) {
          count++;
          permReserves.push(obj);
        }

      }
      if (permReserves.length === 1) {
        return permReserves[0];
      }


    } else {
      return false;
    }

  }

  return false;
};

export const repeatPermanentReservations = async () => {
  try {
    const courts = await model.courtModel.find();

    for (const court of courts) {

      for (const [ dayOfWeek, reserves ] of Object.entries(court.unavailableDates)) {

        const PermanentReserve = checkIfPermanentReservationsExist(reserves);
       
        if (PermanentReserve) {

          const initialTime = typeof PermanentReserve.initialTime === 'string'
            ? new Date(PermanentReserve.initialTime)
            : new Date(PermanentReserve.initialTime);

          const finalTime = typeof PermanentReserve.finalTime === 'string'
            ? new Date(PermanentReserve.finalTime)
            : new Date(PermanentReserve.finalTime);

          const newInitialTime = new Date(initialTime.getTime() + 7 * 24 * 60 * 60 * 1000).getTime();

          const newFinalTime = new Date(finalTime.getTime() + 7 * 24 * 60 * 60 * 1000).getTime();

          const newPermanentReserve = {
            ...PermanentReserve,
            initialTime: newInitialTime,
            finalTime: newFinalTime,
            date: unidecode(new Date(newInitialTime).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'numeric' }))
          };

          const updatedReserves = [ ...reserves, newPermanentReserve ];

          court.unavailableDates[ dayOfWeek ] = updatedReserves;

          const result = await model.courtModel.updateOne(
            { _id: court._id },
            { $set: { unavailableDates: court.unavailableDates } }
          );
          logger.info(result.modifiedCount + ' permanent reservations repeated for ' + court.name);
        }

      }
    }
  } catch (error) {
    logger.error(error);
  }
};

