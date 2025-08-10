import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/services/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      // Tentar verificar via cookie de sessão personalizada se existir
      return NextResponse.json({ isAdmin: false })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    })

    return NextResponse.json({ isAdmin: user?.isAdmin || false })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Temporariamente, tornar o usuário logado admin (para teste)
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { isAdmin: true }
    })

    return NextResponse.json({ message: 'User is now admin', isAdmin: true })
  } catch (error) {
    console.error('Error updating admin status:', error)
    return NextResponse.json({ error: 'Failed to update admin status' }, { status: 500 })
  }
}