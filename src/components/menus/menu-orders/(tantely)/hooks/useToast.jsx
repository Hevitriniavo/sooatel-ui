import { toast } from 'react-toastify';

function useToast() {
  const showSuccess = (message, options = {}) => {
    toast.success(message, {
      autoClose: 3000,
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    toast.error(message, {
      autoClose: 3000,
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    toast.info(message, {
      autoClose: 3000,
      ...options,
    });
  };

  const showWarning = (message, options = {}) => {
    toast.warn(message, {
      autoClose: 3000,
      ...options,
    });
  };

  return { showSuccess, showError, showInfo, showWarning };
}

export default useToast;
