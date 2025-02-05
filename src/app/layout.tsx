import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ToastContainer } from 'react-toastify';
import './globals.css';

export const metadata: Metadata = {
  title: 'T3A',
  description: 'T3A',
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
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
