'use client'
import { useCart } from '@/components/cart/CartContext';
import { useState } from 'react';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('pix');

  function handleConfirm() {
    // Aqui você pode redirecionar para o pagamento ou chamar a API
    alert(`Compra confirmada via ${paymentMethod}!`);
    clearCart();
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Confirmação de Compra</h2>
      {cart.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="mb-4">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between py-2 border-b">
                <span>{item.name} x {item.quantity}</span>
                <span>{item.price}</span>
              </li>
            ))}
          </ul>
          <div className="mb-4">
            <label className="mr-4">
              <input
                type="radio"
                name="payment"
                value="pix"
                checked={paymentMethod === 'pix'}
                onChange={() => setPaymentMethod('pix')}
              /> Pix
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              /> Cartão de crédito/débito
            </label>
          </div>
          <button className="bg-[#9bf401] px-6 py-2 rounded font-bold" onClick={handleConfirm}>
            Finalizar compra
          </button>
        </>
      )}
    </div>
  );
}
