'use client';
import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function SessionAutoSignOut() {
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      // limpa cookie e manda para login
      signOut({ callbackUrl: '/login' });
    }
  }, [status]);

  return null;
}
