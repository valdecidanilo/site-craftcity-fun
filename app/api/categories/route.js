import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          include: {
            _count: { select: { products: true } }
          }
        },
        _count: { select: { products: true } }
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json({ error: "Erro ao buscar categorias" }, { status: 500 });
  }
}

export async function POST(req) {
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
    const { name, categoryId } = body;
    if (!name)
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );

    const slug = slugify(name);

    if (categoryId) {
      const sub = await prisma.subcategory.create({
        data: { name, slug, categoryId },
      });
      return NextResponse.json(sub);
    } else {
      const cat = await prisma.category.create({
        data: { name, slug },
      });
      return NextResponse.json(cat);
    }
  } catch (error) {
    console.error("Erro ao criar categoria/subcategoria:", error);
    return NextResponse.json(
      { error: "Erro ao criar categoria ou subcategoria" },
      { status: 500 }
    );
  }
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
