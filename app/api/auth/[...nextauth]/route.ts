// app/api/auth/[...nextauth]/route.ts
export const runtime = 'nodejs';

import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: { prompt: 'consent', access_type: 'offline', response_type: 'code' },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        senha: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true, name: true, email: true, nickname: true, idade: true,
            image: true, senha: true, isAdmin: true,
          },
        });
        if (!user?.senha) return null;
        const ok = await bcrypt.compare(credentials.senha, user.senha);
        if (!ok) return null;
        const { senha, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as any).uid = (user as any).id;

      if ((token as any).uid) {
        const dbUser = await prisma.user.findUnique({
          where: { id: (token as any).uid as string },
          select: { id: true, isAdmin: true, nickname: true, idade: true },
        });

        if (!dbUser) {
          (token as any).invalidated = true;
          delete (token as any).uid;
          return token;
        }

        (token as any).isAdmin = dbUser.isAdmin ?? false;
        (token as any).nickname = dbUser.nickname ?? null;
        (token as any).idade = dbUser.idade ?? null;
      }

      return token;
    },

    async session({ session, token }) {
      if (!(token as any)?.uid || (token as any)?.invalidated) {
        return {
          user: undefined as any,
          expires: new Date(0).toISOString(),
        } as any;
      }

      if (session.user) {
        (session.user as any).id = (token as any).uid;
        (session.user as any).isAdmin = (token as any).isAdmin ?? false;
        (session.user as any).nickname = (token as any).nickname ?? null;
        (session.user as any).idade = (token as any).idade ?? null;
      }
      return session;
    },
  },

  events: {
    async createUser({ user }) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { nickname: '', idade: null },
        });
      } catch (e) {
        console.error('events.createUser error:', e);
      }
    },
    async signIn({ user, account }) {
      console.log(`Login realizado: ${user.email} via ${account?.provider}`);
    },
  },

  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
