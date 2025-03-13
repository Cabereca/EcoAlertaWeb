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
    const user = getCookie<User>('user');
    const token = getCookie<string>('token');

    if (user && token) {
      setUser(user);
      setToken(token);
      setIsAuthenticated(true);
    }
    login(user, token);
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
