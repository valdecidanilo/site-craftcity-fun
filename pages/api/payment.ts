import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'X-Idempotency-Key': `${process.env.MERCADOPAGO_X_IDEMPOTENCY_KEY}`
        }
      }
    )
    res.status(200).json(response.data)
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao criar pagamento', details: error?.response?.data || error.message })
  }
}