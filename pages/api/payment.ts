import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const idempotencyKey = uuidv4()

    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      {
        ...req.body,
        payment_method_id: req.body.payment_method_id || 'pix' // valor padrão se não vier do frontend
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'X-Idempotency-Key': idempotencyKey
        }
      }
    )

    res.status(200).json(response.data)
  } catch (error: any) {
    console.error('Erro Mercado Pago:', error?.response?.data || error.message)
    res.status(500).json({ error: 'Erro ao criar pagamento', details: error?.response?.data || error.message })
  }
}
