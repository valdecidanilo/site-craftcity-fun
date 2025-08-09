import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Busca o primeiro usuário cadastrado (exemplo)
  const user = await prisma.user.findFirst();
  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const user = await prisma.user.create({ data });
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  if (!data.id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });
  const user = await prisma.user.update({ where: { id: data.id }, data });
  return NextResponse.json(user);
}
