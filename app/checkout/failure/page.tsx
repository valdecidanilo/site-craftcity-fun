'use client'
import { Header } from '@/components/header/header';
import Link from 'next/link';

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: '#151923' }}>
      <div className="w-full fixed top-0 left-0 z-50">
        <Header />
      </div>
      <div className="pt-20 lg:pt-24 flex flex-col items-center justify-center px-4 flex-1">
        <div className="w-full max-w-2xl mx-auto p-4 lg:p-8 bg-[#181c2b] rounded-xl shadow-lg mt-8 lg:mt-12 mb-8 lg:mb-12 text-center">
          <div className="text-red-500 text-6xl mb-6">✗</div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-red-500">Pagamento Falhou</h2>
          <p className="text-base lg:text-lg mb-6">
            Houve um problema ao processar seu pagamento. Tente novamente ou entre em contato conosco.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/checkout" 
              className="inline-block bg-[#9bf401] text-gray-900 px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-[#bfff5a] transition"
            >
              Tentar novamente
            </Link>
            <Link 
              href="/" 
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-gray-700 transition"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}