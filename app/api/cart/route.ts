import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET: retorna o carrinho do usuário autenticado
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });
  return NextResponse.json(cart || { items: [] });
}

// POST: adiciona ou atualiza um item no carrinho
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  const { productId, quantity } = await req.json();
  if (!productId || !quantity || quantity < 1) {
    return NextResponse.json({ error: 'Produto ou quantidade inválida' }, { status: 400 });
  }
  // Busca ou cria o carrinho
  let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: user.id } });
  }
  // Busca o produto para pegar o preço atual
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
  // Adiciona ou atualiza o item
  const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  let item;
  if (existing) {
    item = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity, price: product.discountPrice ?? product.price },
    });
  } else {
    item = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        price: product.discountPrice ?? product.price,
      },
    });
  }
  return NextResponse.json(item);
}

// DELETE: remove um item do carrinho
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: 'Produto inválido' }, { status: 400 });
  const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
  if (!cart) return NextResponse.json({ error: 'Carrinho não encontrado' }, { status: 404 });
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
  return NextResponse.json({ ok: true });
}
