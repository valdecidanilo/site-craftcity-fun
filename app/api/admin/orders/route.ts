import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/admin/orders?nickname=nick
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nickname = searchParams.get('nickname');

  const where = nickname
    ? { user: { nickname: { equals: nickname, mode: 'insensitive' } } }
    : {};

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, nickname: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, minecraftCommand: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(orders);
}

// POST /api/admin/orders/:orderItemId/resend
export async function POST(req: Request) {
  // Implementar lógica de reenviar comando para o Minecraft
  // Recebe orderItemId e executa o comando novamente
  // Atualiza campos commandSent, commandSentAt, commandResponse
  return NextResponse.json({ ok: true });
}
