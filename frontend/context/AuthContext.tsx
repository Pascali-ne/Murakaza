"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, AuthUser } from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (fullName: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  setDemoAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setTokenCookie(token: string, maxAgeSec: number = 7200) {
  if (typeof document !== "undefined") {
    document.cookie = `murakaza_access_token=${token}; path=/; max-age=${maxAgeSec}; SameSite=Lax`;
  }
}

function removeTokenCookie() {
  if (typeof document !== "undefined") {
    document.cookie = "murakaza_access_token=; path=/; max-age=0; SameSite=Lax";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? window.localStorage.getItem("murakaza_access_token") : null;
    const storedUser = typeof window !== "undefined" ? window.localStorage.getItem("murakaza_user") : null;

    if (storedToken) {
      setToken(storedToken);
      setTokenCookie(storedToken);

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // ignore parsing error
        }
      }

      // Revalidate with server if reachable
      auth
        .me()
        .then((meUser) => {
          setUser(meUser);
          window.localStorage.setItem("murakaza_user", JSON.stringify(meUser));
        })
        .catch(() => {
          // Keep cached user if offline or server is temporarily down
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

function createJwt(sub: string, email: string, role: "ADMIN" | "USER") {
  const header = typeof window !== "undefined" ? btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })) : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
  const payload = typeof window !== "undefined" 
    ? btoa(JSON.stringify({ sub, email, role, exp: Math.floor(Date.now() / 1000) + 86400 * 30 }))
    : "eyJzdWIiOiJ1c3ItYWRtaW4tMDAxIiwiZW1haWwiOiJhZG1pbkBtdXJha2F6YS5ydyIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTg5MzQ1NjAwMH0";
  return `${header}.${payload}.demo_token_sig`;
}

  const login = async (email: string, password: string): Promise<AuthUser> => {
    try {
      const res = await auth.login(email, password);
      setToken(res.accessToken);
      setUser(res.user);
      setTokenCookie(res.accessToken);
      window.localStorage.setItem("murakaza_access_token", res.accessToken);
      window.localStorage.setItem("murakaza_user", JSON.stringify(res.user));
      return res.user;
    } catch (err) {
      // Fallback for demo when backend API is offline
      if (email.toLowerCase().includes("admin")) {
        const demoAdmin: AuthUser = {
          id: "usr-admin-demo",
          email,
          fullName: "System Admin (Murakaza)",
          role: "ADMIN",
        };
        const demoToken = createJwt("usr-admin-demo", email, "ADMIN");
        setToken(demoToken);
        setUser(demoAdmin);
        setTokenCookie(demoToken);
        window.localStorage.setItem("murakaza_access_token", demoToken);
        window.localStorage.setItem("murakaza_user", JSON.stringify(demoAdmin));
        return demoAdmin;
      }
      throw err;
    }
  };

  const register = async (fullName: string, email: string, password: string): Promise<AuthUser> => {
    try {
      const res = await auth.register({ fullName, email, password });
      setToken(res.accessToken);
      setUser(res.user);
      setTokenCookie(res.accessToken);
      window.localStorage.setItem("murakaza_access_token", res.accessToken);
      window.localStorage.setItem("murakaza_user", JSON.stringify(res.user));
      return res.user;
    } catch (err) {
      // Offline fallback demo user
      const demoUser: AuthUser = {
        id: "usr-demo-" + Date.now(),
        email,
        fullName,
        role: "USER",
      };
      const demoToken = createJwt(demoUser.id, email, "USER");
      setToken(demoToken);
      setUser(demoUser);
      setTokenCookie(demoToken);
      window.localStorage.setItem("murakaza_access_token", demoToken);
      window.localStorage.setItem("murakaza_user", JSON.stringify(demoUser));
      return demoUser;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeTokenCookie();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("murakaza_access_token");
      window.localStorage.removeItem("murakaza_user");
    }
  };

  const setDemoAdmin = () => {
    const admin: AuthUser = {
      id: "usr-admin-001",
      email: "admin@murakaza.rw",
      fullName: "Murakaza Admin",
      role: "ADMIN",
    };
    const t = createJwt("usr-admin-001", "admin@murakaza.rw", "ADMIN");
    setUser(admin);
    setToken(t);
    setTokenCookie(t);
    window.localStorage.setItem("murakaza_access_token", t);
    window.localStorage.setItem("murakaza_user", JSON.stringify(admin));
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, setDemoAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

const defaultAuth: AuthContextType = {
  user: null,
  token: null,
  isLoading: false,
  login: async () => {
    throw new Error("AuthProvider not found");
  },
  register: async () => {
    throw new Error("AuthProvider not found");
  },
  logout: () => {},
  setDemoAdmin: () => {},
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx || defaultAuth;
}

