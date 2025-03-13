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
    // const user = getCookie<TUser>('user');
    // const token = getCookie<string>('token');

    // if (user && token) {
    //   setUser({ user, token });
    //   setIsAuthenticated(true);
    // }
    const user: Employee = {
      id: '00f2c9d3-df2f-411c-b6e9-e66d45c38417',
      email: 'teste@email.com',
      name: 'Teste',
      registrationNumber: '123456',
      phone: '11 99999-9999',
      occurrence: [],
    };
    login(
      user,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZsYXZpb0BlbWFpbC5jb20iLCJpYXQiOjE3NDE4MDk2NTgsImV4cCI6MTc0MTgzODQ1OH0.W0XaxNINY5jJjmDTbx8yev1hNklSYoPrKhsVC3Hhm8c'
    );
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
