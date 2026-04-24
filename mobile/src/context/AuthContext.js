import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth as authApi } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate session from storage on mount
  useEffect(() => {
    const rehydrate = async () => {
      try {
        const [storedUser, storedToken] = await AsyncStorage.multiGet([
          "user",
          "token",
        ]);
        const parsedUser = storedUser[1] ? JSON.parse(storedUser[1]) : null;
        const parsedToken = storedToken[1] || null;
        setUser(parsedUser);
        setToken(parsedToken);
      } catch {
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    rehydrate();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    const { user: newUser, token: newToken } = res.data;
    try {
      await AsyncStorage.multiSet([
        ["user", JSON.stringify(newUser)],
        ["token", newToken],
      ]);
    } catch {
      // Continue even if storage fails — user will need to log in again next session
    }
    setUser(newUser);
    setToken(newToken);
    return newUser;
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["user", "token"]);
    } catch {
      // Ignore
    }
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
