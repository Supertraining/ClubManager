import { useAxiosInstance } from '../../../hooks';
import { useNotifications } from '../../../hooks';
import { useClub } from '../../club/useClub';
import { localEventInstant } from '../eventDates';
export const useEventsAPI = () => {
  const axios = useAxiosInstance();
  const { club } = useClub();
  const { notifyWarning, notifySuccess, notifyError } = useNotifications();

  const deleteReserve = async (id) => {
    try {
      const { status } = await axios.delete(`/events/deleteById/${id}`);

      status === 200 && notifySuccess('Evento Eliminado');
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const createEvent = async (eventData, date, calendarData) => {
    try {
      const day = date.format('YYYY-MM-DD');
      const start = localEventInstant(day, eventData.horaInicia, club.timezone);
      if (eventData.horaInicia === eventData.horaFinaliza) throw new Error('Indicá horas distintas de inicio y fin.');
      const endDay = eventData.horaFinaliza < eventData.horaInicia ? date.add(1, 'day').format('YYYY-MM-DD') : day;
      const end = localEventInstant(endDay, eventData.horaFinaliza, club.timezone);
      const { status } = await axios.post(`/events/createEvent`, {
        ...eventData,
        start_time: start,
        end_time: end,
        calendarData: [calendarData],
      });

      if (status === 201) notifySuccess('Evento creado.');
    } catch (error) {
      notifyWarning(error.response?.data || error.message);
      throw error;
    }
  };

  const updateEvent = async (id, isSettled) => {
    try {
      
      const {status} = await axios.put('/events/updateEvent', { id: id, saldado: isSettled });
      
      status === 200 && isSettled && notifySuccess('Evento saldado')
      status === 200 && !isSettled && notifyError('Evento aun no saldado')
    } catch (error) {
      console.log(error)
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  return { deleteReserve, createEvent, updateEvent };
};
