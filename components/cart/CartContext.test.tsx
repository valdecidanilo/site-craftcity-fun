import React, { ReactNode } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

(globalThis as any).React = React;

import { CartProvider, useCart } from './CartContext';

describe('CartContext', () => {
  const product = { id: '1', name: 'Test Product', price: 100 };
  let store: Record<string, string>;
  let setItemSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    store = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key: string) => store[key] ?? null
    );
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key: string, value: string) => {
        store[key] = value;
      }
    );
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(
      (key: string) => {
        delete store[key];
      }
    );
    vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
      store = {};
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  it('adds items to cart and updates localStorage', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(product));

    expect(result.current.cart).toEqual([{ ...product, quantity: 1 }]);
    await waitFor(() =>
      expect(setItemSpy).toHaveBeenLastCalledWith(
        'cart',
        JSON.stringify([{ ...product, quantity: 1 }])
      )
    );
  });

  it('updates item quantity and persists to localStorage', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(product));
    act(() => result.current.updateQuantity(product.id, 1));

    expect(result.current.cart).toEqual([{ ...product, quantity: 2 }]);
    await waitFor(() =>
      expect(setItemSpy).toHaveBeenLastCalledWith(
        'cart',
        JSON.stringify([{ ...product, quantity: 2 }])
      )
    );
  });

  it('removes item from cart and updates localStorage', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(product));
    act(() => result.current.removeFromCart(product.id));

    expect(result.current.cart).toEqual([]);
    await waitFor(() =>
      expect(setItemSpy).toHaveBeenLastCalledWith('cart', JSON.stringify([]))
    );
  });
});

