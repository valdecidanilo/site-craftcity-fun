
'use client';
import { useCart } from './CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

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
              <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
              <span className="ml-4 font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => removeFromCart(item.id)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">Remover</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between items-center">
        <button onClick={clearCart} className="px-4 py-2 bg-gray-300 rounded">Limpar carrinho</button>
        <span className="font-bold">Total: R$ {cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
      </div>
    </div>
  );
}
