import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { seedUser } from "@/lib/seed/seedUser";

export type UserRole = "superadmin" | "admin" | "user";
export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  name: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Inisialisasi user dari localStorage atau seed
  useEffect(() => {
    // Selalu update dengan data seed terbaru
    localStorage.setItem("users", JSON.stringify(seedUser));
    
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setUser(found);
      localStorage.setItem("currentUser", JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}; 