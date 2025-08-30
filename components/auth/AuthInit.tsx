'use client'
import { useSession } from "next-auth/react"

export function AuthInit() {
  useSession()
  return null
}