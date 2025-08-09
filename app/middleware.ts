import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Lista de rotas que precisam de login
  const protectedRoutes = ['/account', '/checkout', '/cart'];

  if (protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      const signinUrl = new URL('/auth/signin', req.url);
      signinUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(signinUrl);
    }
  }

  return NextResponse.next();
}

// Só intercepta as rotas protegidas
    export const config = {
    matcher: ['/account/:path*', '/checkout/:path*', '/cart/:path*'],
};
