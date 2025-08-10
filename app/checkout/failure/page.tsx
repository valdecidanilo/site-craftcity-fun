'use client'
import { Header } from '@/components/header/header';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function CheckoutFailure() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-[#151923] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#181c2b] rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Pagamento Cancelado
        </h1>
        <p className="text-gray-300 mb-6">
          O pagamento foi cancelado ou rejeitado.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-[#9bf401] text-gray-900 py-3 rounded-lg font-bold hover:bg-[#bfff5a] transition"
          >
            Tentar Novamente
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full border border-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-700 transition"
          >
            Voltar à Loja
          </button>
        </div>
      </div>
    </div>
  );
}