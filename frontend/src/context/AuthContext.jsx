import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi, clearToken, getToken, setToken, setUnauthorizedHandler } from "../services/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => !!getToken()); // checking a saved token

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  useEffect(() => { setUnauthorizedHandler(logout); }, [logout]);

  // On page load, verify the saved token with the server.
  useEffect(() => {
    if (!getToken()) return;
    authApi.me()
      .then((res) => setUser(res.data.user))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout]);

  const handleAuthSuccess = (res) => {
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const login = async (credentials) => handleAuthSuccess(await authApi.login(credentials));
  const register = async (details) => handleAuthSuccess(await authApi.register(details));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);