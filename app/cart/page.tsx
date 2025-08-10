
'use client';
import Cart from '../../components/cart/Cart';
import { Header } from '@/components/header/header';
import { Toast, notify } from '@/components/toast/Toast';
import { useState, useEffect } from 'react';
import { useCart } from '../../components/cart/CartContext';

export default function CartPage() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const canCheckout = mounted && cart.length > 0;
  const [toast, setToast] = useState<{ message: string; duration?: number } | null>(null);

  useEffect(() => {
    function handleToast(e: any) {
      setToast({ message: e.detail.message, duration: e.detail.duration });
    }
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  function handleCheckoutClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (cart.length === 0) {
      e.preventDefault();
      notify('Seu carrinho está vazio!', 3000);
    }
  }

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: '#151923' }}>
      <div className="w-full fixed top-0 left-0 z-50">
        <Header />
      </div>
      <div className="pt-20 lg:pt-24 flex flex-col items-center justify-center px-4 flex-1">
        <div className="w-full max-w-2xl mx-auto p-4 lg:p-8 bg-[#181c2b] rounded-xl shadow-lg mt-8 lg:mt-12 mb-8 lg:mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center">Seu Carrinho</h2>
          <Cart />
          <div className="mt-6 lg:mt-8 flex justify-center sm:justify-end">
            <a
              href="/checkout" // href constante evita mismatch
              onClick={(e) => {
                if (!canCheckout) {
                  e.preventDefault();
                  notify('Seu carrinho está vazio!', 3000);
                }
              }}
              className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-bold text-base lg:text-lg shadow transition w-full sm:w-auto text-center ${
                canCheckout ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              Próximo Passo
            </a>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} duration={toast.duration} onClose={() => setToast(null)} />}
    </div>
  );
}
