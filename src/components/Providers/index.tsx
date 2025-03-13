'use client';

import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { UserAuthProvider } from '@/context/UserAuthContext';
import VLibras from '@djpfs/react-vlibras';
import { PropsWithChildren } from 'react';
import { Toaster } from '../ui/sonner';

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      <AdminAuthProvider>
        <UserAuthProvider>
          {children}
          <Toaster />
          <VLibras />
        </UserAuthProvider>
      </AdminAuthProvider>
    </>
  );
};
