import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  authApi, userApi, clearToken, getToken, setToken, setUnauthorizedHandler,
} from "../services/api.js";

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

  const applySession = (res) => {
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const login = async (credentials) => applySession(await authApi.login(credentials));
  const register = async (details) => applySession(await authApi.register(details));

  const updateProfile = async (data) => {
    const res = await userApi.updateProfile(data);
    setUser(res.data.user);
  };

  // The server returns a fresh token, because the old one stops working after a password change.
  const changePassword = async (data) => applySession(await userApi.changePassword(data));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);