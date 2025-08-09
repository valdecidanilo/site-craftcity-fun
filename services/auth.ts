import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  events: {
    async createUser({ user }) {
      // preenche campos extras na 1ª vez
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { nickname: "", idade: null },
        });
      } catch {}
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true, nickname: true, idade: true },
        });
        (token as any).uid = dbUser?.id;
        (token as any).nickname = dbUser?.nickname ?? null;
        (token as any).idade = dbUser?.idade ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).uid;
        (session.user as any).nickname = (token as any).nickname ?? null;
        (session.user as any).idade = (token as any).idade ?? null;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
