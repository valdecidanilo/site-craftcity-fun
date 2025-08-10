import axios from 'axios'

export const pagarProduto = async (product: any) => {
  try {
    // Determina o preço correto (discountPrice ou price)
    let price: number;
    
    if (product.discountPrice) {
      // Se discountPrice é string, converter
      if (typeof product.discountPrice === 'string') {
        price = Number(product.discountPrice.replace(/[^\d,.-]/g, '').replace(',', '.'));
      } else {
        price = Number(product.discountPrice);
      }
    } else {
      // Se price é string, converter
      if (typeof product.price === 'string') {
        price = Number(product.price.replace(/[^\d,.-]/g, '').replace(',', '.'));
      } else {
        price = Number(product.price);
      }
    }

    // Monta o payload compatível com sua API /api/payment
    const paymentData = {
      items: [{
        id: product.id?.toString() || '1',
        name: product.name,
        price: price,
        quantity: 1,
        image: product.image,
        category: product.category || 'others'
      }],
      paymentMethod: 'checkout_pro', // Sempre Checkout Pro para compra direta
      buyer: {
        email: 'test_user_123@testuser.com', // Você pode tornar isso dinâmico
        name: 'Test User'
      }
    };

    console.log('Enviando para API:', paymentData);

    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data?.message || data?.error || 'Erro no pagamento');
    }

    return data;
    
  } catch (error) {
    console.error('Erro em pagarProduto:', error);
    throw error;
  }
};