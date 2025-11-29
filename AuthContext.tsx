import React, { createContext, useState, useEffect } from "react";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (userData: any, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load saved auth from storage
  useEffect(() => {
    const storedUser = localStorage.getItem("voxai_user");
    const storedToken = localStorage.getItem("voxai_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (userData: any, token: string) => {
    setUser(userData);
    setToken(token);

    localStorage.setItem("voxai_user", JSON.stringify(userData));
    localStorage.setItem("voxai_token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("voxai_user");
    localStorage.removeItem("voxai_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
