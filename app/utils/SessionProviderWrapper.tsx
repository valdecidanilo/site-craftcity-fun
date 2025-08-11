'use client';
import { SessionProvider } from 'next-auth/react';

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
}
