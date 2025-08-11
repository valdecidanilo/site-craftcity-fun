import { UserProfileModalGlobal } from './utils/UserProfileModalGlobal';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { CartProvider } from '../components/cart/CartContext';
import SessionProviderWrapper from './utils/SessionProviderWrapper';
import { Inter } from 'next/font/google'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import AuthProvider from '@/components/providers/session-provider'

export const metadata: Metadata = {
  title: 'Craft City',
  description: 'Created with claude',
};

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="pt">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <SessionProviderWrapper>
          <CartProvider>
            <AuthProvider session={session}>
              {children}
              <UserProfileModalGlobal />
            </AuthProvider>
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
