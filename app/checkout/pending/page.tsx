'use client'
import { Header } from '@/components/header/header';
import Link from 'next/link';

export default function CheckoutPendingPage() {
  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: '#151923' }}>
      <div className="w-full fixed top-0 left-0 z-50">
        <Header />
      </div>
      <div className="pt-20 lg:pt-24 flex flex-col items-center justify-center px-4 flex-1">
        <div className="w-full max-w-2xl mx-auto p-4 lg:p-8 bg-[#181c2b] rounded-xl shadow-lg mt-8 lg:mt-12 mb-8 lg:mb-12 text-center">
          <div className="text-yellow-500 text-6xl mb-6">⏳</div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-yellow-500">Pagamento Pendente</h2>
          <p className="text-base lg:text-lg mb-6">
            Seu pagamento está sendo processado. Você receberá uma confirmação assim que for aprovado.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-[#9bf401] text-gray-900 px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-[#bfff5a] transition"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}