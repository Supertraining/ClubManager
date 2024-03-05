import { useAxiosInstance } from '../../../hooks';
import { useNotifications } from '../../../hooks';
export const useEventsAPI = () => {
  const axios = useAxiosInstance();
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
      const { status } = await axios.post(`/events/createEvent`, {
        ...eventData,
        date: new Date(date).toLocaleDateString(),
        calendarData: calendarData,
      });

      status === 200 && notifySuccess('Evento Creado');
    } catch (error) {
      console.log(error);
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
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
