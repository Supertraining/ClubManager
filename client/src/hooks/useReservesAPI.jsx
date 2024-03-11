import { v4 as uuidv4 } from 'uuid';
import unidecode from 'unidecode';
import { useNotifications } from './useNotifications';
import { useAxiosInstance } from './useAxiosInstance';
import { userStore } from '../stores/index';

export const useReservesAPI = () => {
  const { notifyWarning } = useNotifications();
  const axios = useAxiosInstance();

  const {
    user: { user },
    updateUser,
  } = userStore();

  const createDate = (initialTime) => {
    const weekday = new Date(initialTime).toLocaleDateString('es-AR', { weekday: 'long' });
    const unaccentedWeekday = unidecode(weekday);
    const date = new Date(initialTime).toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
    });
    const unaccentedDate = unidecode(date);

    return {
      unaccentedWeekday,
      unaccentedDate,
    };
  };

  const createUserReserve = async (
    court,
    initialTime,
    finalTime,
    UUID,
    unaccentedWeekday,
    unaccentedDate
  ) => {
    try {
      await axios.put(`/users/reserves/${user.username}`, {
        court: `${court}`,
        weekday: unaccentedWeekday,
        date: unaccentedDate,
        initialTime: initialTime,
        finalTime: finalTime,
        id: UUID,
        permanent: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createCourtReserve = async (
    court,
    unaccentedWeekday,
    unaccentedDate,
    initialTime,
    finalTime,
    UUID
  ) => {
    try {
      await axios.put('/courts/reserve', {
        name: `${court}`,
        selectedDates: {
          weekday: unaccentedWeekday,
          date: unaccentedDate,
          initialTime: initialTime,
          finalTime: finalTime,
          user: user.username,
          id: UUID,
          info: null,
          permanent: false,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createReserve = async (court, initialTime, finalTime) => {

    const { unaccentedWeekday, unaccentedDate } = createDate(initialTime);

    const UUID = uuidv4();

    try {

      createUserReserve(
        court,
        initialTime,
        finalTime,
        UUID,
        unaccentedWeekday,
        unaccentedDate
      );

      createCourtReserve(court, unaccentedWeekday, unaccentedDate, initialTime, finalTime, UUID);

   
        updateUser();
      
    } catch (error) {
      console.log(error)
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const deleteUserReserve = async (username, id) => {
    await axios.put(`/users/reserves/delete`, {
      username: username,
      reserveId: id,
    });
  };

  const deleteCourtReserve = async (court, day, id) => {
    await axios.put(`/courts/reserve/delete`, {
      courtName: court,
      reserveDay: day,
      reserveId: id,
    });
  };

  return {
    createUserReserve,
    createCourtReserve,
    createReserve,
    deleteUserReserve,
    deleteCourtReserve,
  };
};
