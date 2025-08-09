import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/services/auth";

const noStore = { "Cache-Control": "no-store" };

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions); // ✅ v4
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401, headers: noStore });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true, nickname: true, idade: true, image: true },
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

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions); // ✅ v4
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401, headers: noStore });
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

    return NextResponse.json({ message: "Atualizado com sucesso", ...updated }, { headers: noStore });
  } catch (e: any) {
    console.error("PUT /api/user failed:", e);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500, headers: noStore });
  }
}