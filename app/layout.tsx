import { UserProfileModalGlobal } from './UserProfileModalGlobal';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { CartProvider } from '../components/cart/CartContext';

export const metadata: Metadata = {
  title: 'Craft City',
  description: 'Created with v0',
  generator: 'v0.dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <CartProvider>
          {children}
        </CartProvider>
        <UserProfileModalGlobal />
      </body>
    </html>
  );
}
