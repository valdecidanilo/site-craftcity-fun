// app/api/payment/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function parseBRL(v: string | number): number {
  if (typeof v === 'number') return v;
  // "R$ 59,99" -> 59.99
  return Number(
    v.replace(/[^\d,.-]/g, '')  // remove R$ e espaços
     .replace(/\./g, '')        // separador de milhar
     .replace(',', '.')         // decimal
  );
}

export async function POST(req: NextRequest) {
  try {
    const { items, paymentMethod } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
    }

    // Determina se deve usar modo de teste baseado na variável de ambiente
    const useTestMode = process.env.MERCADOPAGO_TEST_MODE === 'true' || process.env.NODE_ENV === 'development';
    const MP_ACCESS_TOKEN = useTestMode
      ? (process.env.MERCADOPAGO_ACCESS_TOKEN_TEST)
      : (process.env.MERCADOPAGO_ACCESS_TOKEN);
    
    if (!MP_ACCESS_TOKEN) {
      return NextResponse.json({ 
        error: `Token MercadoPago ausente para modo ${useTestMode ? 'teste' : 'produção'}` 
      }, { status: 500 });
    }

    // monta itens no formato do Checkout Pro
    const mpItems = items.map((it: any) => ({
      title: it.name,
      quantity: Number(it.quantity || 1),
      currency_id: 'BRL',
      unit_price: parseBRL(it.price),
      picture_url: it.image || undefined,
      category_id: it.category || undefined,
    }));

    // total
    const transactionAmount = mpItems.reduce((s: number, i: any) => s + i.unit_price * i.quantity, 0);
    
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    console.log('Base URL para callbacks:', baseUrl);

    // preferência (Checkout Pro)
    const body = {
      items: mpItems,
      payer: {
        // preencha se tiver
        email: items[0]?.buyerEmail || undefined,
        name: items[0]?.buyerName || undefined,
      },
      back_urls: {
        success: `${baseUrl}/checkout/success`,
        failure: `${baseUrl}/checkout/failure`,
        pending: `${baseUrl}/checkout/pending`,
      },
      // auto_return: 'approved', // removido temporariamente para testar
      notification_url: `${baseUrl}/api/webhook/mercadopago`,
      statement_descriptor: 'CRAFTCITY',
      // Se quiser priorizar PIX/cartão no Checkout Pro:
      // payment_methods: {
      //   default_payment_method_id: paymentMethod === 'pix' ? 'pix' : undefined,
      // },
      metadata: {
        cart_total: transactionAmount,
        project: 'craftcity',
      },
    };

    console.log('Payload enviado ao MercadoPago:', JSON.stringify(body, null, 2));

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error('Erro MercadoPago:', {
        status: res.status,
        statusText: res.statusText,
        data: data,
        token_usado: MP_ACCESS_TOKEN?.substring(0, 20) + '...',
        modo_teste: useTestMode
      });
      
      return NextResponse.json(
        { 
          error: 'MercadoPago error', 
          status: res.status,
          detail: data,
          message: data?.message || data?.error || 'Erro desconhecido'
        },
        { status: 502 }
      );
    }

    // retorna as URLs de redirecionamento
    return NextResponse.json({
      init_point: data.init_point,               // produção
      sandbox_init_point: data.sandbox_init_point, // sandbox
      id: data.id,
      test_mode: useTestMode, // indica qual modo está sendo usado
    });
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro interno', detail: String(e?.message || e) }, { status: 500 });
  }
}
