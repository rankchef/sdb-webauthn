import { useState, useCallback, useEffect } from 'react';
import { apiFetch } from '../api';

export const useSession = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch('/me');
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        setUser(null);
        return null;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Authentication error');
      }

      setUser(data.user);
      return data.user;
    } catch (err) {
      setUser(null);
      setError(err.message || 'Неуспешна автентикација');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = async () => {
    await apiFetch('/logout', { method: 'POST' });
    setUser(null);
  };

  return { user, isLoading, error, fetchUser, setUser, logout };
};
