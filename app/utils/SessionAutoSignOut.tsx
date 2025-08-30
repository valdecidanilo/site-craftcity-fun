'use client';
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SessionAutoSignOut() {
  const { status } = useSession();
  const router = useRouter();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (status === 'authenticated') {
      wasAuthenticated.current = true;
    }
    if (status === 'unauthenticated' && wasAuthenticated.current) {
      // Só redireciona se o usuário estava autenticado antes
      router.replace('/');
      wasAuthenticated.current = false;
    }
  }, [status, router]);

  return null;
}
