// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/services/auth';

const noStore = { 'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate' };

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401, headers: noStore });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true, nickname: true, idade: true, image: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404, headers: noStore });
    }

    return NextResponse.json(user, { headers: noStore });
  } catch (e) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500, headers: noStore });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.email) return NextResponse.json({ error: 'Email obrigatório' }, { status: 400, headers: noStore });

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.nome ?? data.name ?? null,
        nickname: data.nickname ?? null,
        idade: data.idade ?? null,
      },
    });

    return NextResponse.json(user, { headers: noStore });
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400, headers: noStore });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401, headers: noStore });
    }

    const body = await req.json().catch(() => ({}));
    const data: any = {};
    if (body.nome !== undefined) data.name = body.nome;
    if (body.name !== undefined) data.name = body.name;
    if (body.nickname !== undefined) data.nickname = body.nickname;
    if (body.idade !== undefined) data.idade = body.idade === null ? null : Number(body.idade);

    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data,
      select: { id: true, name: true, email: true, nickname: true, idade: true, image: true },
    });

    // mensagem opcional para o client mostrar
    return NextResponse.json({ message: 'Atualizado com sucesso', ...updated }, { headers: noStore });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500, headers: noStore });
  }
}
