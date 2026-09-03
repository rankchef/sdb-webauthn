import { useToast } from '../hooks/useToast';

const Toast = ({ message, isError }) => {
  const { displayMessage, isExiting } = useToast(message);

  if (!displayMessage) return null;

  return (
    <div className={`toast-container ${isError ? 'error' : 'success'} ${isExiting ? 'exiting' : 'entering'}`}>
      <span>{displayMessage}</span>
    </div>
  );
};

export default Toast;
