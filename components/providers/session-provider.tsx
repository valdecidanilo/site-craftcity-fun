'use client'

import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"

export default function AuthProvider({
  children,
  session
}: {
  children: React.ReactNode
  session?: Session | null
}) {
  return (
    <SessionProvider 
      session={session}
      // Refetch session a cada 5 minutos
      refetchInterval={5 * 60}
      // Refetch quando a janela recebe foco
      refetchOnWindowFocus={true}
      // Importante: define o comportamento quando não há token
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  )
}