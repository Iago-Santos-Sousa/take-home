"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface UserContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
  initialUser: User | null; // Vem do Server Component (layout.tsx)
}

export function UserProvider({ children, initialUser }: UserProviderProps) {
  const [user, setUserState] = useState<User | null>(initialUser);

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
  }, []);

  // useMemo evita re-renders desnecessários em toda a árvore
  const value = useMemo<UserContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.role === "admin",
      setUser,
      clearUser,
    }),
    [user, setUser, clearUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser deve ser usado dentro de <UserProvider>");
  }

  return context;
}
