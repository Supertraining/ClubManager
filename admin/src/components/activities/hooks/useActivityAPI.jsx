import { useAxiosInstance } from '../../../hooks';
import { useNotifications } from '../../../hooks';

const useActivityAPI = () => {
  const axios = useAxiosInstance();
  const { notifyWarning, notifySuccess } = useNotifications();

  const getActivityById = async (id) => {
    try {
      const { status, data } = await axios.get(`/activities/getById/${id}`);

      if (status === 200) {
        return data;
      }
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const updateActivity = async (id, activityData) => {
    try {
      const { status } = await axios.put(`/activities/update/${id}`, activityData);

      status === 200 && notifySuccess('Actividad actualizada');
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const deleteActivity = async (id) => {
    try {
      const {
        data: { deletedCount },
      } = await axios.delete(`/activities/deleteById/${id}`);
      return deletedCount;
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  const createActivity = async (activityData) => {
    try {

      const { status } = await axios.post('/activities/save', activityData);

      status === 200 && notifySuccess('Actividad creada');
    } catch (error) {
      notifyWarning(`Hubo un problema, ${error?.response?.data}`);
    }
  };

  return { getActivityById, updateActivity, deleteActivity, createActivity };
};

export default useActivityAPI;
