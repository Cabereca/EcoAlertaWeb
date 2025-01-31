import { useCookie } from '@/hooks/useCookie';
import { AuthUser, TUser } from '@/utils/types/auth';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

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
    const user = getCookie<TUser>('user');
    const token = getCookie<string>('token');

    if (user && token) {
      setUser({ user, token });
      setIsAuthenticated(true);
    }
  }, [getCookie]);

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
