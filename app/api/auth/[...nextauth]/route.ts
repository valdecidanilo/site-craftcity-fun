// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: '/auth/signin', // opcional: página customizada de login
    error: '/auth/error',   // opcional: página customizada de erro
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: { 
              id: true, 
              name: true, 
              email: true, 
              nickname: true, 
              idade: true, 
              image: true, 
              senha: true, 
              isAdmin: true 
            }
          });

          if (!user || !user.senha) return null;

          const ok = await bcrypt.compare(credentials.senha, user.senha);
          if (!ok) return null;

          const { senha, ...userWithoutPassword } = user;
          return userWithoutPassword;
        } catch (error) {
          console.error("Erro na autorização:", error);
          return null;
        }
      }
    }),
  ],
  events: {
    async createUser({ user }) {
      // preenche campos extras na 1ª vez
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            nickname: "", 
            idade: null, 
            provider: "google" 
          },
        });
        console.log(`Usuário criado: ${user.email}`);
      } catch (error) {
        console.error("Erro ao criar usuário:", error);
      }
    },
    async signIn({ user, account }) {
      console.log(`Login realizado: ${user.email} via ${account?.provider}`);
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google" && profile?.email) {
          // Verifica se usuário já existe com este email
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });
          
          if (existingUser) {
            // Usuário existe, permite login automático
            return true;
          }
        }
        return true;
      } catch (error) {
        console.error("Erro no callback signIn:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { 
              id: true, 
              nickname: true, 
              idade: true, 
              isAdmin: true 
            },
          });
          
          if (dbUser) {
            token.uid = dbUser.id;
            token.nickname = dbUser.nickname ?? null;
            token.idade = dbUser.idade ?? null;
            token.isAdmin = dbUser.isAdmin ?? false;
          }
        }
        return token;
      } catch (error) {
        console.error("Erro no callback JWT:", error);
        return token;
      }
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.uid;
        (session.user as any).nickname = token.nickname ?? null;
        (session.user as any).idade = token.idade ?? null;
        (session.user as any).isAdmin = token.isAdmin ?? false;
      }
      return session;
    },
  },
  // Configurações para melhorar a performance
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  },
  // Debug apenas em desenvolvimento
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };