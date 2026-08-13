import { createContext, useContext, useState } from "react";
import { login as loginApi, logout as logoutApi } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email, password) => {
    return loginApi(email, password).then((res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    });
  };

  const logout = () => {
    logoutApi().finally(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);