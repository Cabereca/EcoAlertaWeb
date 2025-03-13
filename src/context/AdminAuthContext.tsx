'use client';

import { useCookie } from '@/hooks/useCookie';
import { Employee } from '@/types/Employee';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

interface AdminAuthContextProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: Employee | null;
  token: string | null;
  login: (user: Employee, token: string) => void;
  logout: VoidFunction;
}

export const AdminAuthContext = createContext<AdminAuthContextProps | undefined>(undefined);

export const AdminAuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<Employee | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { setCookie, getCookie, removeCookie } = useCookie();

  useEffect(() => {
    const userJson = getCookie<string>('user');
    const token = getCookie<string>('token');
    if (userJson && token) {
      const user = JSON.parse(userJson);
      setUser(user);
      setToken(token);
      setIsAdmin(true);
      setIsAuthenticated(true);
      login(user, token);
    }
  }, []);

  const login = (user: Employee, token: string) => {
    setCookie('user', JSON.stringify(user));
    setCookie('token', token);
    setToken(token);
    setIsAdmin(true);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
    setIsAdmin(false);
    removeCookie('user');
    removeCookie('token');
  };

  return (
    <AdminAuthContext.Provider value={{ user, token, isAdmin, isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
