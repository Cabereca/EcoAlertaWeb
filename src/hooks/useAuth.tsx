import { AdminAuthContext } from '@/context/AdminAuthContext';
import { UserAuthContext } from '@/context/UserAuthContext';
import { useContext } from 'react';

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
