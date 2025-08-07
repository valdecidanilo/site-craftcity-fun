
import axios from 'axios';

// Função para criar um pagamento usando integração REST
export async function createPayment({ title, price, quantity = 1 }: { title: string, price: number, quantity?: number }) {
  const preference = {
    items: [
      {
        title,
        quantity,
        currency_id: 'BRL',
        unit_price: price,
      }
    ],
    // Você pode adicionar mais opções aqui, como callback URLs
  };

  try {
    const response = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      preference,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        }
      }
    );
    return response.data.init_point; // URL para o checkout
  } catch (error: any) {
    throw error;
  }
}