import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    const normalized = String(email || '').trim().toLowerCase()
    if (!normalized) {
      return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: normalized },
      select: { id: true },
    })

    return NextResponse.json({ exists: !!user })
  } catch (e) {
    return NextResponse.json({ error: 'Falha ao verificar email' }, { status: 500 })
  }
}
