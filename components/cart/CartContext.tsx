'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

export type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  [key: string]: any;
};

export type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);


export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isLogged = status === 'authenticated' && !!session?.user;
  const [cart, setCart] = useState<CartItem[]>([]);


  // Função para buscar carrinho do backend
  async function fetchCartFromBackend() {
    const res = await fetch('/api/cart');
    const data = await res.json();
    if (data && data.items) {
      setCart(data.items.map((item: any) => {
        // Sempre sobrescreve com os dados atuais do produto do banco
        const p = item.product;
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          discountPrice: p.discountPrice,
          image: p.image,
          description: p.description,
          category: p.category,
          subcategory: p.subcategory,
          isDiscounted: !!p.discountPrice,
          quantity: item.quantity,
        };
      }));
    } else {
      setCart([]);
    }
  }

  // Carrega carrinho do backend ou localStorage ao logar/deslogar
  useEffect(() => {
    if (isLogged) {
      fetchCartFromBackend();
    } else {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
      setCart(stored ? JSON.parse(stored) : []);
    }
  }, [isLogged]);

  // Sempre que a aba for focada, recarrega o carrinho do backend para garantir preços atualizados
  useEffect(() => {
    if (!isLogged) return;
    function onFocus() {
      fetchCartFromBackend();
    }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [isLogged]);

  // Salva no localStorage para visitantes
  useEffect(() => {
    if (!isLogged && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLogged]);

  async function addToCart(product: Product) {
    if (isLogged) {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      if (res.ok) {
        const item = await res.json();
        setCart(prev => {
          const exists = prev.find(i => i.id === product.id);
          if (exists) {
            return prev.map(i => i.id === product.id ? { ...i, quantity: item.quantity, price: item.price } : i);
          } else {
            return [...prev, { ...product, quantity: item.quantity, price: item.price }];
          }
        });
      }
    } else {
      setCart(prev =>
        prev.some(item => item.id === product.id)
          ? prev.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prev, { ...product, quantity: 1 }]
      );
    }
  }

  async function removeFromCart(id: string) {
    if (isLogged) {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id }),
      });
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.filter(item => item.id !== id));
    }
  }

  async function updateQuantity(id: string, delta: number) {
    if (isLogged) {
      const item = cart.find(i => i.id === id);
      if (!item) return;
      const newQty = Math.max(1, item.quantity + delta);
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, quantity: newQty }),
      });
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));
    } else {
      setCart(prev =>
        prev
          .map(item =>
            item.id === id
              ? { ...item, quantity: Math.max(1, item.quantity + delta) }
              : item
          )
          .filter(item => item.quantity > 0)
      );
    }
  }

  async function clearCart() {
    if (isLogged) {
      // Remove todos os itens do carrinho do backend
      const current = [...cart];
      for (const item of current) {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: item.id }),
        });
      }
      setCart([]);
    } else {
      setCart([]);
    }
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
