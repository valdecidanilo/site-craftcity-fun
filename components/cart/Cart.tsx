
'use client';
import { useCart } from './CartContext';
import { useEffect, useState } from 'react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (cart.length === 0) {
    return <div className="p-4">Seu carrinho está vazio.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Carrinho</h2>
      <ul>
        {cart.map(item => (
          <li key={item.id} className="flex items-center justify-between mb-2 border-b pb-2">
            <div className="flex items-center gap-2">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
              )}
              <span>{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.id, -1)} 
                className="w-8 h-8 bg-red-600 text-white rounded-lg font-bold text-2xl flex items-center justify-center">-</button>
              <input
                type="number"
                min={1}
                style={{background: '#151923' }}
                value={item.quantity}
                onChange={e => {
                  const value = Number(e.target.value);
                  if (value > 0) updateQuantity(item.id, value - item.quantity);
                }}
                className="w-12 text-center border rounded"
              />
              <button onClick={() => updateQuantity(item.id, 1)} 
                className="w-8 h-8 bg-green-500 text-white rounded-lg font-bold text-2xl flex items-center justify-center">+</button>
              <span className="ml-4 font-semibold">
                R$ {(
                  (item.isDiscounted && item.discountPrice
                    ? Number(String(item.discountPrice).replace(/[^\d.,]/g, '').replace(',', '.'))
                    : item.price
                  ) * item.quantity
                ).toFixed(2)}
              </span>
              <button onClick={() => removeFromCart(item.id)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">Remover</button>
            </div>
          </li>
        ))}
      </ul>
        <div className="mt-4 flex flex-col gap-2">
            {/* Valor total de desconto */}
            <div className="flex justify-end text-green-400 font-semibold mb-2">
              {(() => {
                const totalDiscount = cart.reduce((acc, item) => {
                  if (item.isDiscounted && item.discountPrice) {
                    const price = Number(String(item.price).replace(/[^\d.,]/g, '').replace(',', '.'));
                    const discount = Number(String(item.discountPrice).replace(/[^\d.,]/g, '').replace(',', '.'));
                    return acc + (price - discount) * item.quantity;
                  }
                  return acc;
                }, 0);
                return totalDiscount > 0 ? `Você economizou: R$ ${totalDiscount.toFixed(2)}` : null;
              })()}
            </div>
            <div className="flex justify-between items-center">
              <button onClick={clearCart} className="px-4 py-2 bg-[#151923] rounded">Limpar carrinho</button>
              <span className="font-bold">Total: R$ {(
                cart.reduce((acc, item) => {
                  const price = item.isDiscounted && item.discountPrice
                    ? Number(String(item.discountPrice).replace(/[^\d.,]/g, '').replace(',', '.'))
                    : item.price;
                  return acc + price * item.quantity;
                }, 0)
              ).toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
}
