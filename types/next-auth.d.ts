// types/next-auth.d.ts
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      nickname?: string | null
      idade?: number | null
      isAdmin?: boolean
    }
  }

  interface User {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
    nickname?: string | null
    idade?: number | null
    isAdmin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string
    nickname?: string | null
    idade?: number | null
    isAdmin?: boolean
  }
}