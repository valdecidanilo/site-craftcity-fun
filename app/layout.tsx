import './globals.css';
import { UserProfileModalGlobal } from '@/components/auth/UserProfileModalGlobal';
import SessionProviderWrapper from './utils/SessionProviderWrapper';
import { CartProvider } from '@/components/cart/CartContext';
import SessionAutoSignOut from '@/app/utils/SessionAutoSignOut';
import { AuthInit } from '@/components/auth/AuthInit';

export const metadata = {
  title: 'Craft City',
  description: 'Created with claude',
};

export default function RootLayout({ children } : 
  { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <SessionProviderWrapper>
          <CartProvider>
            <AuthInit />
            {children}
            <UserProfileModalGlobal />
            <SessionAutoSignOut />
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
