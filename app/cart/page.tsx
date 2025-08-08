import Cart from '../../components/cart/Cart';

export default function CartPage() {
  return (
    <main className="max-w-2xl mx-auto py-8">
      <Cart />
      <div className="mt-8 flex justify-end">
        <a href="/checkout" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Confirmar compra</a>
      </div>
    </main>
  );
}
