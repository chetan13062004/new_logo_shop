import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import ClientProviders from '@/components/shared/client-providers'
import { APP_DESCRIPTION, APP_NAME} from '@/lib/constants'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ClientProviders>
            {children}
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}