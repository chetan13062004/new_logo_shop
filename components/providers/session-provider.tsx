'use client'

import { SessionProvider } from 'next-auth/react'

export default function NextAuthSessionProvider({
  children,
  session
}: {
  children: React.ReactNode
  session: Record<string, unknown>
}) {
  return <SessionProvider session={{
    user: session.user as { role: string } & Record<string, unknown>,
    expires: session.expires as string
  }}>{children}</SessionProvider>
}