"use client"
import { SessionProvider } from "next-auth/react"

interface AuthProviderInterface {
  readonly children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderInterface) {
  return <SessionProvider>{children}</SessionProvider>
}
