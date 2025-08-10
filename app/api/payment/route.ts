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
type BuyerInput = { email?: string; name?: string; };
type RequestBody = { items: CartItemInput[]; paymentMethod?: 'pix'|'card'|'checkout_pro'; buyer?: BuyerInput; };

function parseBRL(v: string | number): number {
  if (typeof v === 'number') return v;
  const only = v.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '');
  const normalized = only.replace(',', '.');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}
function normalizeCategory(c?: string): string | undefined {
  if (!c) return undefined;
  const s = c.toLowerCase();
  if (s.includes('cosm')) return 'cosmetics';
  if (s.includes('eletr') || s.includes('electr')) return 'electronics';
  if (s.includes('serv')) return 'services';
  return 'others';
}
const isHttps = (url?: string) => !!url && /^https:\/\//i.test(url);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    const { items, paymentMethod, buyer } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const useTestMode = process.env.NODE_ENV === 'development';

    const MP_ACCESS_TOKEN = useTestMode
      ? process.env.MERCADOPAGO_ACCESS_TOKEN_TEST
      : process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!MP_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: `Token do Mercado Pago ausente para modo ${useTestMode ? 'teste' : 'produção'}` },
        { status: 500 }
      );
    }

    const mpItems = items.map((it) => {
      const quantity = Number(it.quantity ?? 1);
      const unit_price = parseBRL(it.price);
      return {
        title: String(it.name ?? 'Item'),
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        currency_id: 'BRL',
        unit_price: unit_price >= 0 ? unit_price : 0,
        picture_url: it.image || undefined,
        category_id: normalizeCategory(it.category),
      };
    });

    const transactionAmount = mpItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

    const baseUrl = useTestMode ? process.env.NEXTAUTH_LOCAL_URL : process.env.NEXTAUTH_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'BASE URL não configurada. Defina PUBLIC_URL/NEXTAUTH_URL/NEXTAUTH_LOCAL_URL.' },
        { status: 500 }
      );
    }

    const payer = {
      email: buyer?.email ?? (session?.user?.email as string | undefined),
      name:  buyer?.name  ?? (session?.user?.name  as string | undefined),
    };
    if (!payer.email) {
      return NextResponse.json({ error: 'Email do comprador é obrigatório (payer.email).' }, { status: 400 });
    }

    const preferencePayload: any = {
      items: mpItems,
      payer,
      back_urls: {
        success: `${baseUrl}/checkout/success`,
        failure: `${baseUrl}/checkout/failure`,
        pending: `${baseUrl}/checkout/pending`,
      },
      notification_url: `${baseUrl}/api/webhook/mercadopago`,
      statement_descriptor: 'CRAFTCITY',
      metadata: {
        cart_total: Number(transactionAmount.toFixed(2)),
        project: 'craftcity',
        paymentMethod: paymentMethod ?? 'checkout_pro',
        env: useTestMode ? 'test' : 'prod',
      },
    };

    // Só liga auto_return se a success URL for HTTPS (evita 400 em localhost)
    if (isHttps(preferencePayload.back_urls.success)) {
      preferencePayload.auto_return = 'approved';
    }

    console.log('[MP] Criando preferência:', JSON.stringify(
      { ...preferencePayload, payer: { ...preferencePayload.payer, email: '***' } }, null, 2
    ));

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify(preferencePayload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error('Mercado Pago ERROR:', {
        status: res.status,
        statusText: res.statusText,
        data,
        modo_teste: useTestMode,
      });
      return NextResponse.json(
        { error: 'MercadoPago error', status: res.status, detail: data, message: data?.message || data?.error || 'Erro desconhecido' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
      test_mode: useTestMode,
    });
  } catch (e: any) {
    console.error('[MP] EXCEPTION:', e);
    return NextResponse.json({ error: 'Erro interno', detail: String(e?.message || e) }, { status: 500 });
  }
}
