// // import React from 'react'

// // import Header from '@/components/shared/header'
// // import Footer from '@/components/shared/footer'

// // export default async function RootLayout({
// //   children,
// // }: {
// //   children: React.ReactNode
// // }) {
// //   return (
// //     <div className='flex flex-col min-h-screen'>
// //       <Header />
// //       <main className='flex-1 flex flex-col p-4'>{children}</main>
// //       <Footer />
// //     </div>
// //   )
// // }

// import { Geist, Geist_Mono } from 'next/font/google'
// import '../globals.css'
// import ClientProviders from '@/components/shared/client-providers'
// // import { getDirection } from '@/i18n-config'
// // import { NextIntlClientProvider } from 'next-intl'
// // import { getMessages } from 'next-intl/server'
// // import { routing } from '@/i18n/routing'
// import { notFound } from 'next/navigation'
// // import { getSetting } from '@/lib/actions/setting.actions'
// import { cookies } from 'next/headers'
// import { APP_DESCRIPTION, APP_NAME, APP_SLOGAN } from '@/lib/constants'

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// })

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// })

// export async function generateMetadata() {
//   // const {
//   //   site: { slogan, name, description, url },
//   // } = await getSetting()
//   return {
//     title: {
//       template: `%s | ${APP_NAME}`,
//       default: `${APP_NAME}. ${APP_SLOGAN}`,
//     },
//     description: APP_DESCRIPTION,
//     // metadataBase: new URL(url),
//   }
// }

// export default async function AppLayout({
//   params,
//   children,
// }: {
//   params: { locale: string }
//   children: React.ReactNode
// }) {
//   // const setting = await getSetting()
//   // const currencyCookie = (await cookies()).get('currency')
//   // const currency = currencyCookie ? currencyCookie.value : 'USD'

//   // const { locale } = await params
//   // // Ensure that the incoming `locale` is valid
//   // // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   // if (!routing.locales.includes(locale as any)) {
//   //   notFound()
//   // }
//   // const messages = await getMessages()

//   return (
//     <html
//       lang='en'
//       suppressHydrationWarning
//     >
//       <body
//         className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {/* <NextIntlClientProvider locale={locale} messages={messages}> */}
//           <ClientProviders >
//             {children}
//           </ClientProviders>
//         {/* </NextIntlClientProvider> */}
//       </body>
//     </html>
//   )
// }

import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import ClientProviders from '@/components/shared/client-providers'
import { notFound } from 'next/navigation'
import { APP_DESCRIPTION, APP_NAME, APP_SLOGAN } from '@/lib/constants'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME} - ${APP_SLOGAN}`,
  },
  description: APP_DESCRIPTION,
}

export default async function AppLayout({
  params,
  children,
}: {
  params: { locale: string }
  children: React.ReactNode
}) {
  // Ensure that the incoming `locale` is valid
  if (!params.locale) {
    notFound()
  }

  return (
    <html lang='en' suppressHydrationWarning>
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
