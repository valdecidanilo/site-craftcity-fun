import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from 'bcryptjs';

const noStore = { "Cache-Control": "no-store" };
const SALT_ROUNDS = 10;

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401, headers: noStore });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true, nickname: true, idade: true, image: true, isAdmin: true },
    });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404, headers: noStore });
    }
    return NextResponse.json(user, { headers: noStore });
  } catch (e: any) {
    console.error("GET /api/user failed:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500, headers: noStore });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, senha, nome, nickname, idade } = body;
    
    if (!email || !senha || senha.length < 6) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400, headers: noStore });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409, headers: noStore });
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const created = await prisma.user.create({
      data: {
        email,
        senha: senhaHash,
        name: nome,
        nickname,
        idade: idade ? Number(idade) : null,
        provider: "email"
      },
      select: { id: true, name: true, email: true, nickname: true, idade: true, image: true, isAdmin: true },
    });

    return NextResponse.json({ message: "Usuário criado com sucesso", ...created }, { headers: noStore });
  } catch (e: any) {
    console.error("POST /api/user failed:", e);
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500, headers: noStore });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401, headers: noStore });
    }
    const body = await req.json().catch(() => ({}));
    const data: any = {};
    if (body.nome !== undefined) data.name = body.nome;
    if (body.name !== undefined) data.name = body.name;
    if (body.nickname !== undefined) data.nickname = body.nickname;
    if (body.idade !== undefined) data.idade = body.idade === null ? null : Number(body.idade);
    
    if (typeof body.senha === 'string' && body.senha.trim()) {
      if (body.senha.length < 6) {
        return NextResponse.json({ error: 'A nova senha precisa ter pelo menos 6 caracteres.' }, { status: 400, headers: noStore });
      }
      data.senha = await bcrypt.hash(body.senha, SALT_ROUNDS);
    }

    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data,
      select: { id: true, name: true, email: true, nickname: true, idade: true, image: true, isAdmin: true },
    });

    return NextResponse.json({ message: "Atualizado com sucesso", ...updated }, { headers: noStore });
  } catch (e: any) {
    console.error("PUT /api/user failed:", e);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500, headers: noStore });
  }
}