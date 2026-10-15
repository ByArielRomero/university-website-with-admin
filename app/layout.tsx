import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Centro Universitario - Exaltación de la Cruz',
  description: 'Centro Universitario de Exaltación de la Cruz - Formación académica de calidad en la región',
  generator: 'Centro Universitario Exaltación de la Cruz',
  icons: {
    icon: [
      {
        url: '/logo-escudo.png',
        type: 'image/png',
      },
    ],
    apple: '/logo-escudo.png',
  },
}

import Providers from './providers'

// ... existing code ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`} suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
