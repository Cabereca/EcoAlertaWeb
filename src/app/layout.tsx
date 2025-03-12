import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ToastContainer } from 'react-toastify';
import './globals.css';

export const metadata: Metadata = {
  title: 'EcoAlerta',
  description: 'EcoAlerta é uma plataforma de denúncias de crimes ambientais.',
};

const garetFont = localFont({ src: '../utils/fonts/Garet.ttf' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${garetFont.className} antialiased`}>
        <time dateTime="2016-10-25" suppressHydrationWarning />
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
