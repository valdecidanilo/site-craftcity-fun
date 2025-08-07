import axios from 'axios'

export const pagarProduto = async (product : any) => {
  // Extrai o preço correto
  const price = product.discountPrice
    ? Number(product.discountPrice.replace('R$', '').replace(',', '.'))
    : Number(product.price.replace('R$', '').replace(',', '.'));

  // Monta o objeto para Mercado Pago
  const paymentData = {
    additional_info: {
      items: [
        {
          id: product.id?.toString() || '1',
          title: product.name,
          description: product.description,
          picture_url: product.image ? (typeof window !== 'undefined' ? `${window.location.origin}${product.image}` : product.image) : undefined,
          category_id: product.category || 'default',
          quantity: 1,
          unit_price: price,
        }
      ]
    },
    description: `Pagamento do produto ${product.name}`,
    external_reference: `PROD-${product.id}`,
    transaction_amount: price,
    installments: 1,
    payer: {
      email: 'test_user_123@testuser.com', // pode ser dinâmico
      identification: {
        type: 'CPF',
        number: '95749019047', // pode ser dinâmico
      }
    }
  }

  const response = await axios.post('/api/payment', paymentData)
  return response.data.url || response.data.init_point || response.data.sandbox_init_point || response.data;
}