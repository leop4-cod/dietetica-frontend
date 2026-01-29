import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { login as loginRequest } from "../api/auth.service";
import { getUser } from "../api/users.service";
import type { User } from "../api/auth.service";
import { STORAGE_TOKEN_KEY, STORAGE_USER_KEY } from "../api/axios";
import { normalizeRole, type Role } from "./permissions";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    mode?: "cliente" | "admin"
  ) => Promise<Role | null>;
  logout: () => void;
  role: Role | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const loadFromStorage = () => {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  const rawUser = localStorage.getItem(STORAGE_USER_KEY);
  if (!token || !rawUser) return { token: null, user: null };
  try {
    const user = JSON.parse(rawUser) as User;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = loadFromStorage();
  const [token, setToken] = useState<string | null>(stored.token);
  const [user, setUser] = useState<User | null>(stored.user);
  const [loading, setLoading] = useState(false);

  const persistSession = (nextToken: string, nextUser: User) => {
    localStorage.setItem(STORAGE_TOKEN_KEY, nextToken);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setToken(null);
    setUser(null);
  };

  const login = async (email: string, password: string, mode?: "cliente" | "admin") => {
    setLoading(true);
    try {
      const data = await loginRequest({ email, password });
      if (!data.access_token) {
        throw new Error("No recibimos el token de acceso.");
      }
      let user = data.user;
      let normalizedRole = normalizeRole(user?.role ?? (user as any)?.rol);
      if (!normalizedRole && user?.id) {
        const freshUser = await getUser(String(user.id));
        user = { ...user, ...freshUser } as User;
        normalizedRole = normalizeRole((user as any)?.role ?? (user as any)?.rol);
      }
      if (mode === "admin" && normalizedRole !== "ADMIN" && normalizedRole !== "EMPLEADO") {
        throw new Error("No autorizado");
      }
      if (mode === "cliente" && normalizedRole !== "CLIENTE") {
        throw new Error("No autorizado");
      }
      persistSession(data.access_token, user);
      return normalizedRole;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  const role = useMemo(() => normalizeRole(user?.role ?? (user as any)?.rol), [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      role,
    }),
    [user, token, loading, login, logout, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}

export function hasRole(allowed: Role[] | undefined, currentRole: Role | null) {
  if (!allowed || allowed.length === 0) return true;
  if (!currentRole) return false;
  return allowed.includes(currentRole);
}
