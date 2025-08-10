// app/api/products/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/services/auth'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
      select: { isAdmin: true },
    })
    if (!user?.isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const body = await request.json()
    const { name, price, discountPrice, description, category, subcategory, image } = body

    if (!name || price === undefined || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const priceNum = Number(price)
    if (Number.isNaN(priceNum)) return NextResponse.json({ error: 'Preço inválido' }, { status: 400 })

    let discountNum: number | null = null
    if (discountPrice !== undefined && discountPrice !== null && discountPrice !== '') {
      discountNum = Number(discountPrice)
      if (Number.isNaN(discountNum)) return NextResponse.json({ error: 'Preço com desconto inválido' }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        price: priceNum,
        discountPrice: discountNum,
        description,
        category,
        subcategory: subcategory || null,
        image: image || null,
      },
    })

    return NextResponse.json({
      ...product,
      price: Number(product.price),
      discountPrice: product.discountPrice != null ? Number(product.discountPrice) : null,
      isDiscounted: product.discountPrice != null,
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
      select: { isAdmin: true },
    })
    if (!user?.isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
