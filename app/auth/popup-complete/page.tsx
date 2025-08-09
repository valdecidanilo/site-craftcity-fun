'use client';

import { Button } from '@/components/button/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Image from 'next/image';
import Success from '@/public/craftcity/avatar-success.png';
import Fail from '@/public/craftcity/avatar-fail.png';

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
        <Image
            src={Success}
            alt="Login concluído"
            width={256}
            height={256}
            priority
        />
        <p>Login concluído. Você pode volta para o inicio.</p>
        <Button
        style={{ fontSize: '20px', backgroundColor: '#9bf401', color: '#151923' }}
        onClick={() => {
            router.push('/');
        }}
        >
        Voltar para a home
        </Button>
    </div>
    );
}
