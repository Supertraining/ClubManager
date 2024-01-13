import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useNotifications = () => {

  const notify = (text) => toast(`${text}`, { autoClose: 2000 });
  
  const notifySuccess = (text) =>
    toast.success(`${text}`, {
      position: 'bottom-right',
      autoClose: 1000,
      theme: 'dark',
    });

  const notifyWarning = (text) =>
    toast.warn(`${text}`, {
      position: 'bottom-right',
      autoClose: 2000,
      theme: 'dark',
    });

  const notifyError = (text) =>
    toast.error(`${text}`, {
      position: 'bottom-right',
      autoClose: 1000,
      theme: 'dark'
    });


  return {
    notify,
    notifySuccess,
    notifyWarning,
    notifyError,
  };
};

export default useNotifications;
