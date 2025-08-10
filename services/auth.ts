import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, name: true, email: true, nickname: true, idade: true, image: true, senha: true, isAdmin: true }
        });

        if (!user || user.senha !== credentials.senha) {
          return null;
        }

        // Remove senha do retorno
        const { senha, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }),
  ],
  events: {
    async createUser({ user }) {
      // preenche campos extras na 1ª vez
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { nickname: "", idade: null, provider: "google" },
        });
      } catch {}
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        // Check if user already exists with this email
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });
        
        if (existingUser) {
          // User exists, allow automatic login
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true, nickname: true, idade: true, isAdmin: true },
        });
        (token as any).uid = dbUser?.id;
        (token as any).nickname = dbUser?.nickname ?? null;
        (token as any).idade = dbUser?.idade ?? null;
        (token as any).isAdmin = dbUser?.isAdmin ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).uid;
        (session.user as any).nickname = (token as any).nickname ?? null;
        (session.user as any).idade = (token as any).idade ?? null;
        (session.user as any).isAdmin = (token as any).isAdmin ?? false;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
