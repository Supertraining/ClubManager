import { v4 as uuidv4 } from 'uuid';
import unidecode from 'unidecode';
import useNotifications from './useNotifications';
import useAxiosInstance from './useAxiosInstance';
import { userStore } from '../stores/index';

const useReserves = () => {
  const { notifyWarning } = useNotifications();
  const axios = useAxiosInstance();

  const {
    user: { user: admin },
    updateUser,
  } = userStore();

  const createUserReserve = async (
    court,
    initialTime,
    finalTime,
    permanent,
    username,
    UUID,
    unaccentedWeekday,
    unaccentedDate
  ) => {
    try {
      await axios.put(`/users/reserves/${username}`, {
        court: `${court}`,
        weekday: unaccentedWeekday,
        date: unaccentedDate,
        initialTime: initialTime,
        finalTime: finalTime,
        id: UUID,
        permanent: permanent,
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
    username,
    UUID,
    info,
    permanent
  ) => {
    try {
      await axios.put('/courts/reserve', {
        name: `${court}`,
        selectedDates: {
          weekday: unaccentedWeekday,
          date: unaccentedDate,
          initialTime: initialTime,
          finalTime: finalTime,
          user: username,
          id: UUID,
          info: info.length > 0 ? info : null,
          permanent: permanent,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createReserve = async (court, initialTime, finalTime, permanent, info, username) => {

    const weekday = new Date(initialTime).toLocaleDateString('es-AR', {
      weekday: 'long',
    });
    const unaccentedWeekday = unidecode(weekday);

    const date = new Date(initialTime).toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
    });
    const unaccentedDate = unidecode(date);

    const UUID = uuidv4();

    try {
      
      createUserReserve(
        court,
        initialTime,
        finalTime,
        permanent,
        username,
        UUID,
        unaccentedWeekday,
        unaccentedDate
      );

      createCourtReserve(
        court,
        unaccentedWeekday,
        unaccentedDate,
        initialTime,
        finalTime,
        username,
        UUID,
        info,
        permanent
      );

      if (permanent) {

        const today = new Date(initialTime);
        const oneWeekFromNow = today.setDate(today.getDate() + 7);
        const dateOneWeekFromNow = unidecode(
          new Date(oneWeekFromNow).toLocaleDateString('es-AR', {
            weekday: 'long',
            day: 'numeric',
            month: 'numeric',
          })
        );

        const initialTimeWeekFromNow = new Date(today.getTime());
        const todayFinalTime = new Date(finalTime);
        const finalTimeWeekFromNow = new Date(
          todayFinalTime.getTime() + 7 * 24 * 60 * 60 * 1000
        ).getTime();

        createUserReserve(
          court,
          initialTime,
          finalTime,
          permanent,
          username,
          UUID,
          unaccentedWeekday,
          dateOneWeekFromNow
        );

        createCourtReserve(
          court,
          unaccentedWeekday,
          dateOneWeekFromNow,
          initialTimeWeekFromNow,
          finalTimeWeekFromNow,
          username,
          UUID,
          info,
          permanent
        );
      }

      username === admin.username && updateUser();
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  return {
    createReserve,
  };
};

export default useReserves;
