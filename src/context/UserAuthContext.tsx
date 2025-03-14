'use client';

import { useCookie } from '@/hooks/useCookie';
import { User } from '@/types/User';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const { setCookie, getCookie, removeCookie } = useCookie();

  useEffect(() => {
    const userJson = getCookie<string>('user');
    const token = getCookie<string>('token');
    if (userJson && token) {
      const user = JSON.parse(userJson ?? '');
      setUser(user);
      setToken(token);
      setIsAuthenticated(true);
      login(user, token);
      router.push('/user/home');
    } else {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    router.push('/');
  };

  return (
    <UserAuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};
