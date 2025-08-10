'use client'
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartContext';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    
    console.log('Checkout Success - Payment ID:', paymentId, 'Status:', status);
    
    // Se pagamento aprovado, limpar carrinho
    if (status === 'approved') {
      clearCart();
    }
  }, [searchParams, clearCart]);

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const merchantOrderId = searchParams.get('merchant_order_id');

  return (
    <div className="min-h-screen bg-[#151923] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#181c2b] rounded-xl p-8 text-center">
        {status === 'approved' ? (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-500 mb-4">
              Pagamento Aprovado! 🎉
            </h1>
            <p className="text-gray-300 mb-6">
              Sua compra foi processada com sucesso!
            </p>
          </>
        ) : status === 'pending' ? (
          <>
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-yellow-500 mb-4">
              Pagamento Pendente ⏳
            </h1>
            <p className="text-gray-300 mb-6">
              Aguardando confirmação do pagamento...
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              Ops! Algo deu errado 😕
            </h1>
            <p className="text-gray-300 mb-6">
              Não foi possível processar seu pagamento.
            </p>
          </>
        )}
        
        {paymentId && (
          <p className="text-sm text-gray-400 mb-6">
            ID: {paymentId}
          </p>
        )}
        
        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-[#9bf401] text-gray-900 py-3 rounded-lg font-bold hover:bg-[#bfff5a] transition"
          >
            Voltar à Loja
          </button>
          
          {status !== 'approved' && (
            <button
              onClick={() => router.push('/checkout')}
              className="w-full border border-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-700 transition"
            >
              Tentar Novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}