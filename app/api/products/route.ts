// app/api/products/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/services/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category");
  const subcategorySlug = searchParams.get("subcategory");

  try {
    const products = await prisma.product.findMany({
      where: {
        category: categorySlug ? { is: { slug: categorySlug } } : undefined,
        subcategory: subcategorySlug ? { is: { slug: subcategorySlug } } : undefined,
      },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        subcategory: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || "" },
      select: { isAdmin: true },
    });
    if (!user?.isAdmin)
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );

    const body = await req.json();
    const {
      name,
      price,
      discountPrice,
      description,
      image,
      categoryId,
      subcategoryId,
    } = body;

    if (!name || price === undefined || !description || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const priceNum = Number(price);
    if (Number.isNaN(priceNum))
      return NextResponse.json({ error: "Preço inválido" }, { status: 400 });

    let discountNum: number | null = null;
    if (discountPrice !== undefined && discountPrice !== null && discountPrice !== "") {
      discountNum = Number(discountPrice);
      if (Number.isNaN(discountNum))
        return NextResponse.json(
          { error: "Preço com desconto inválido" },
          { status: 400 }
        );
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: priceNum,
        discountPrice: discountNum,
        description,
        image: image || null,
        categoryId,
        subcategoryId: subcategoryId || null,
      },
    });

    return NextResponse.json({
      ...product,
      price: Number(product.price),
      discountPrice:
        product.discountPrice != null ? Number(product.discountPrice) : null,
      isDiscounted: product.discountPrice != null,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
