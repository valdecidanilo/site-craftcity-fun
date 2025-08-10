'use client'
import { Header } from '@/components/header/header';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function CheckoutPending() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-[#151923] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#181c2b] rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-yellow-500 mb-4">
          Processando Pagamento...
        </h1>
        <p className="text-gray-300 mb-6">
          Aguarde enquanto processamos seu pagamento.
        </p>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-[#9bf401] text-gray-900 py-3 rounded-lg font-bold hover:bg-[#bfff5a] transition"
        >
          Voltar à Loja
        </button>
      </div>
    </div>
  );
}