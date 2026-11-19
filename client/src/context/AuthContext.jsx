import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
const C = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/auth/me")
      .then((r) => setUser(r.data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);
  const login = async (data) => {
    const r = await api.post("/auth/login", data);
    localStorage.setItem("token", r.data.token);
    setUser(r.data.user);
    return r.data.user;
  };
  const register = async (data) => {
    const r = await api.post("/auth/register", data);
    localStorage.setItem("token", r.data.token);
    setUser(r.data.user);
    return r.data.user;
  };
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };
  return (
    <C.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </C.Provider>
  );
};
export const useAuth = () => useContext(C);
