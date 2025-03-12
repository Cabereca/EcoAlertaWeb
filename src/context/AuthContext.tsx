'use client';

import { useCookie } from '@/hooks/useCookie';
import { User } from '@/types/User';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

export interface AuthUser {
  user: User;
  token: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: VoidFunction;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { setCookie, getCookie, removeCookie } = useCookie();

  useEffect(() => {
    // const user = getCookie<TUser>('user');
    // const token = getCookie<string>('token');

    // if (user && token) {
    //   setUser({ user, token });
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
    login({
      user: user,
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZsYXZpb0BlbWFpbC5jb20iLCJpYXQiOjE3NDE4MDk2NTgsImV4cCI6MTc0MTgzODQ1OH0.W0XaxNINY5jJjmDTbx8yev1hNklSYoPrKhsVC3Hhm8c',
    });
  }, []);

  const login = (user: AuthUser) => {
    setCookie('user', JSON.stringify(user.user));
    setCookie('token', user.token);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    removeCookie('user');
    removeCookie('token');
  };

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
