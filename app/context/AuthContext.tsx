"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  username: string;
  setUsername: (username: string) => void;
  logout: () => void; // ✅ Tambahkan ini
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState("");

  const logout = () => {
    localStorage.removeItem("authToken");
    setUsername("");
  };

  return (
    <AuthContext.Provider value={{ username, setUsername, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
