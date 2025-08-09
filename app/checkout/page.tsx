'use client'
import { useCart } from '@/components/cart/CartContext';
import { useState, useEffect } from 'react';
import { Header } from '@/components/header/header';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  async function handleConfirm() {
    if (cart.length === 0) return;
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          paymentMethod, // opcional (pode usar pra default no server)
        }),
      });
      const data = await response.json();

      if (response.ok && data?.init_point) {
        // Usa sandbox_init_point se disponível (modo teste), senão usa init_point (produção)
        const redirectUrl = data.sandbox_init_point || data.init_point;
        window.location.href = redirectUrl;
      } else {
        console.error('Erro na resposta da API:', data);
        alert('Erro ao processar pagamento: ' + (data?.message || data?.error || 'Desconhecido'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar com o servidor de pagamento');
    }
  }

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen text-white" style={{ background: '#151923' }}>
      <div className="w-full fixed top-0 left-0 z-50">
        <Header />
      </div>
      <div className="pt-24 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl mx-auto p-8 bg-[#181c2b] rounded-xl shadow-lg mt-12 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Confirmação de Compra</h2>
          {cart.length === 0 ? (
            <p className="text-center text-lg">Seu carrinho está vazio.</p>
          ) : (
            <>
              <ul className="mb-8 divide-y divide-gray-700">
                {cart.map(item => (
                  <li key={item.id} className="flex justify-between items-center py-4">
                    <span className="font-semibold">{item.name} <span className="text-gray-400">x {item.quantity}</span></span>
                    <span className="font-bold">{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="pix"
                    checked={paymentMethod === 'pix'}
                    onChange={() => setPaymentMethod('pix')}
                    className="accent-green-500"
                  />
                  <span className="font-medium">Pix</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-blue-500"
                  />
                  <span className="font-medium">Cartão de crédito/débito</span>
                </label>
              </div>
              <button
                className="w-full bg-[#9bf401] text-gray-900 px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-[#bfff5a] transition"
                onClick={handleConfirm}
              >
                Finalizar compra
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
