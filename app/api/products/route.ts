// app/api/products/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
