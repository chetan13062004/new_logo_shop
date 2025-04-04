import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import ClientProviders from '@/components/shared/client-providers'
import { APP_DESCRIPTION, APP_NAME, APP_SLOGAN } from '@/lib/constants'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateMetadata() {
  return {
    title: {
      template: `%s | ${APP_NAME}`,
      default: `${APP_NAME}. ${APP_SLOGAN}`,
    },
    description: APP_DESCRIPTION,
  }
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body
        className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}