'use client';

import { useCookie } from '@/hooks/useCookie';
import { User } from '@/types/User';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

interface UserAuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: VoidFunction;
}

export const UserAuthContext = createContext<UserAuthContextProps | undefined>(undefined);

export const UserAuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { setCookie, getCookie, removeCookie } = useCookie();

  useEffect(() => {
    // const user = getCookie<User>('user');
    // const token = getCookie<string>('token');

    // if (user && token) {
    //   setUser(user);
    //   setIsAuthenticated(true);
    // }
    const user = {
      id: '00f2c9d3-df2f-411c-b6e9-e66d45c38417',
      email: 'flavio@email.com',
      name: 'Flávio',
      cpf: '123.456.789-00',
      phone: '11 99999-9999',
      occurrence: [],
    };
    login(
      user,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZsYXZpb0BlbWFpbC5jb20iLCJpYXQiOjE3NDE4MDk2NTgsImV4cCI6MTc0MTgzODQ1OH0.W0XaxNINY5jJjmDTbx8yev1hNklSYoPrKhsVC3Hhm8c'
    );
  }, []);

  const login = (user: User, token: string) => {
    setCookie('user', JSON.stringify(user));
    setCookie('token', token);
    setUser(user);
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    removeCookie('user');
    removeCookie('token');
  };

  return (
    <UserAuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};
