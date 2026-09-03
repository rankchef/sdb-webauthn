import { useEffect, useState } from 'react';

export function useToast(message) {
  const [displayMessage, setDisplayMessage] = useState(message);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      setIsExiting(false);

      const hideTimer = setTimeout(() => {
        setIsExiting(true);
      }, 2000);

      const removeTimer = setTimeout(() => {
        setDisplayMessage(null);
      }, 2300);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [message]);

  return { displayMessage, isExiting };
}
