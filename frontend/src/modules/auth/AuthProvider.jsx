// modules/auth/AuthProvider.jsx
import { useState, useEffect, useCallback } from "react";
import AuthContext from "./authContext.js";
import { authApi, userApi, tokenStorage } from "../../app/api.js";

export default function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      const token = tokenStorage.getAccess();
      if (!token) { setLoading(false); return; }
      try {
        const me = await userApi.getMe();
        setUser(me);
      } catch {
        tokenStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, []);

  const login = useCallback(async (email, password) => {
    await authApi.login(email, password);
    const me = await userApi.getMe();
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await userApi.getMe();
    setUser(me);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}