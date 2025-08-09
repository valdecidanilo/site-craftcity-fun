'use client';

import { Button } from '@/components/button/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PopupComplete() {
  const router = useRouter();

  useEffect(() => {
    try {
      window.opener?.postMessage({ type: 'NEXTAUTH_POPUP_DONE' }, window.location.origin);
    } catch {}
    window.close();
  }, []);

  return (
    <div
      style={{
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        background: '#151923',
        minHeight: '100vh',
      }}
    >
      <p>Login concluído. Você pode fechar esta janela.</p>
      <Button
        style={{ fontSize: '20px' , backgroundColor: '#9bf401', color: '#151923' }}
        onClick={() => {
          router.push('/');
        }}
      >
        Voltar para a home
      </Button>
    </div>
  );
}
