import { createContext, useContext } from 'react';
import { useSession } from '../hooks/useSession';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const session = useSession();

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default AuthProvider;
