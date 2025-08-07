import axios from 'axios'

// Função para obter o access token via OAuth Mercado Pago
export async function getMercadoPagoToken({ client_id, client_secret, code, code_verifier, redirect_uri, refresh_token }: {
  client_id: string,
  client_secret: string,
  code?: string,
  code_verifier?: string,
  redirect_uri?: string,
  refresh_token?: string
}) {
  const payload: any = {
    client_id,
    client_secret,
    grant_type: refresh_token ? 'refresh_token' : 'authorization_code',
  }
  if (refresh_token) {
    payload.refresh_token = refresh_token
  } else {
    payload.code = code
    payload.code_verifier = code_verifier
    payload.redirect_uri = redirect_uri
  }

  try {
    const response = await axios.post(
      'https://api.mercadopago.com/oauth/token',
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error: any) {
    throw error
  }
}
