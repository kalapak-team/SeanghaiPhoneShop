"use client";

import { api } from "@/lib/api";
import { AuthUser } from "@/lib/types";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateUser: (next: AuthUser) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sg_token");
    const savedUser = localStorage.getItem("sg_user");
    if (saved) setToken(saved);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const persist = (nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem("sg_token", nextToken);
    localStorage.setItem("sg_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login: async (email, password) => {
          const res = await api.login({ email, password }) as { token: string; user: AuthUser };
          persist(res.token, res.user);
        },
        register: async (name, email, password, phone) => {
          const res = await api.register({ name, email, password, phone }) as { token: string; user: AuthUser };
          persist(res.token, res.user);
        },
        logout: () => {
          localStorage.removeItem("sg_token");
          localStorage.removeItem("sg_user");
          setToken(null);
          setUser(null);
        },
        updateUser: (next) => {
          localStorage.setItem("sg_user", JSON.stringify(next));
          setUser(next);
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
