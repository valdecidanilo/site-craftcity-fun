// app/api/payment/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth';

type CartItemInput = {
  id?: string | number;
  name: string;
  price: number | string;
  quantity?: number | string;
  image?: string;
  category?: string;
};

type BuyerInput = { 
  email?: string; 
  name?: string; 
};

type RequestBody = {
  items: CartItemInput[];
  paymentMethod?: 'pix' | 'card' | 'checkout_pro';
  buyer?: BuyerInput;
  token?: string;
  installments?: number;
  payment_method_id?: string;
  identification?: { type: 'CPF' | 'CNPJ'; number: string };
  description?: string;
  external_reference?: string;
};

function parseBRL(v: string | number): number {
  if (typeof v === 'number') return Number(v.toFixed(2));
  const cleaned = String(v).replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '');
  const normalized = cleaned.replace(',', '.');
  const n = Number(normalized);
  return Number.isFinite(n) && n > 0 ? Number(n.toFixed(2)) : 0;
}

function normalizeCategory(c?: string): string {
  if (!c) return 'others';
  const s = c.toLowerCase();
  if (s.includes('cosm')) return 'cosmetics';
  if (s.includes('eletr') || s.includes('electr')) return 'electronics';
  if (s.includes('serv')) return 'services';
  if (s.includes('game')) return 'electronics';
  return 'others';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    const { items, paymentMethod = 'checkout_pro', buyer } = body;

    console.log('[PAYMENT API] Received request:', {
      itemsCount: items?.length,
      paymentMethod,
      buyerEmail: buyer?.email ? '***@***' : 'not provided'
    });

    // Validações básicas
    if (!Array.isArray(items) || items.length === 0) {
      console.error('[PAYMENT API] Empty cart');
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const useTestMode = process.env.NODE_ENV === 'development';

    const MP_ACCESS_TOKEN = useTestMode
      ? process.env.MERCADOPAGO_ACCESS_TOKEN_TEST
      : process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!MP_ACCESS_TOKEN) {
      console.error('[PAYMENT API] Missing MP token for mode:', useTestMode ? 'test' : 'prod');
      return NextResponse.json(
        { error: `Token do Mercado Pago não configurado para modo ${useTestMode ? 'teste' : 'produção'}` },
        { status: 500 }
      );
    }

    // Processar itens
    const mpItems = items.map((item, index) => {
      const quantity = Number(item.quantity ?? 1);
      const unit_price = parseBRL(item.price);
      
      if (unit_price <= 0) {
        console.warn(`[PAYMENT API] Item ${index} has invalid price:`, item.price);
      }
      
      return {
        id: String(item.id ?? `item_${index}`),
        title: String(item.name ?? 'Produto sem nome').substring(0, 256), // MP tem limite
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        currency_id: 'BRL',
        unit_price: unit_price,
        picture_url: item.image && item.image.startsWith('http') ? item.image : undefined,
        category_id: normalizeCategory(item.category),
      };
    });

    const transactionAmount = Number(mpItems.reduce((sum, i) => sum + (i.unit_price * i.quantity), 0).toFixed(2));
    
    if (transactionAmount < 1) {
      console.error('[PAYMENT API] Amount too low:', transactionAmount);
      return NextResponse.json({ error: 'Valor mínimo para pagamento é R$ 1,00.' }, { status: 400 });
    }

    const baseUrl = useTestMode ? process.env.NEXTAUTH_LOCAL_URL : process.env.NEXTAUTH_URL;
    if (!baseUrl) {
      console.error('[PAYMENT API] Base URL not configured');
      return NextResponse.json(
        { error: 'URL base não configurada. Verifique NEXTAUTH_URL/NEXTAUTH_LOCAL_URL.' },
        { status: 500 }
      );
    }

    // Payer info
    const payerEmail = buyer?.email || session?.user?.email;
    if (!payerEmail) {
      console.error('[PAYMENT API] No payer email provided');
      return NextResponse.json({ error: 'Email do comprador é obrigatório.' }, { status: 400 });
    }

    const payer = {
      email: String(payerEmail),
      name: buyer?.name || session?.user?.name || 'Cliente',
    };

    console.log('[PAYMENT API] Processing payment:', {
      method: paymentMethod,
      amount: transactionAmount,
      itemsCount: mpItems.length,
      testMode: useTestMode
    });

    // =========================
    // PIX DIRETO
    // =========================
    if (paymentMethod === 'pix') {
      const pixPayload = {
        transaction_amount: transactionAmount,
        payment_method_id: 'pix',
        description: `Pedido CraftCity - ${mpItems.map(i => i.title).join(', ')}`.substring(0, 600),
        external_reference: body.external_reference || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        payer: {
          email: payer.email,
          first_name: payer.name?.split(' ')[0] || 'Cliente',
          last_name: payer.name?.split(' ').slice(1).join(' ') || '',
        },
        additional_info: {
          items: mpItems.map(i => ({
            id: i.id,
            title: i.title,
            description: i.title,
            picture_url: i.picture_url,
            category_id: i.category_id,
            quantity: i.quantity,
            unit_price: i.unit_price,
          })),
          payer: {
            first_name: payer.name?.split(' ')[0] || 'Cliente',
            last_name: payer.name?.split(' ').slice(1).join(' ') || '',
          },
        },
      };

      console.log('[PAYMENT API] PIX payload:', JSON.stringify({
        ...pixPayload,
        payer: { ...pixPayload.payer, email: '***@***' }
      }, null, 2));

      const res = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
          'X-Idempotency-Key': crypto.randomUUID(),
        },
        body: JSON.stringify(pixPayload),
      });

      const data = await res.json().catch(() => ({}));
      console.log('[PAYMENT API] PIX response:', res.status, data);

      if (!res.ok) {
        return NextResponse.json({
          error: 'Erro do Mercado Pago',
          status: res.status,
          detail: data,
          message: data?.message || data?.error || `HTTP ${res.status}`,
        }, { status: 502 });
      }

      return NextResponse.json({
        id: data.id,
        status: data.status,
        qr_code: data.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64,
        ticket_url: data.point_of_interaction?.transaction_data?.ticket_url,
        expires_at: data.date_of_expiration,
      });
    }

    // =========================
    // CHECKOUT PRO (default)
    // =========================
    const preferencePayload = {
      items: mpItems,
      payer: {
        name: payer.name,
        surname: '',
        email: payer.email,
      },
      back_urls: {
        success: `${baseUrl}/checkout/success`,
        failure: `${baseUrl}/checkout/failure`, 
        pending: `${baseUrl}/checkout/pending`,
      },
      // Remover auto_return temporariamente até criar as páginas
      // auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
      notification_url: `${baseUrl}/api/webhook/mercadopago`,
      statement_descriptor: 'CRAFTCITY',
      external_reference: body.external_reference || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        cart_total: transactionAmount,
        items_count: mpItems.length,
        payment_method: paymentMethod,
        user_id: session?.user?.email || 'guest',
        timestamp: new Date().toISOString(),
      },
    };

    console.log('[PAYMENT API] Preference payload:', JSON.stringify({
      ...preferencePayload,
      payer: { ...preferencePayload.payer, email: '***@***' },
      items: preferencePayload.items.map(i => ({ ...i, title: i.title.substring(0, 30) + '...' }))
    }, null, 2));

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify(preferencePayload),
    });

    const data = await res.json().catch(() => ({}));
    
    console.log('[PAYMENT API] Preference response:', res.status, {
      id: data.id,
      init_point: data.init_point ? 'present' : 'missing',
      sandbox_init_point: data.sandbox_init_point ? 'present' : 'missing',
    });

    if (!res.ok) {
      console.error('[PAYMENT API] MP Error:', data);
      return NextResponse.json({
        error: 'Erro do Mercado Pago',
        status: res.status,
        detail: data,
        message: data?.message || data?.error || `HTTP ${res.status}`,
      }, { status: 502 });
    }

    return NextResponse.json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
      test_mode: useTestMode,
    });

  } catch (e: any) {
    console.error('[PAYMENT API] EXCEPTION:', e);
    return NextResponse.json({ 
      error: 'Erro interno do servidor', 
      detail: String(e?.message || e) 
    }, { status: 500 });
  }
}