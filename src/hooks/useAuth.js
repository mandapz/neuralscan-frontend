import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { getMe, logout as apiLogout, registerUser, loginUser } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try { setUser(await getMe()); }
    catch { setUser(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <AuthContext.Provider value={{
      user, loading,
      login: async (identifier, password) => { const u = await loginUser({ identifier, password }); setUser(u); return u; },
      register: async (username, email, password) => { const u = await registerUser({ username, email, password }); setUser(u); return u; },
      logout: async () => { try { await apiLogout(); } catch {} setUser(null); },
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
