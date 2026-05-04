import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Tosco International Inc. — Fine Jewelry',
    template: '%s | Tosco International Inc.',
  },
  description:
    'Exquisite fine jewelry crafted with heritage and precision. Discover our collections of diamonds, emeralds, sapphires, and custom bridal pieces.',
  keywords: ['fine jewelry', 'luxury jewelry', 'diamonds', 'engagement rings', 'Tosco International'],
  authors: [{ name: 'Tosco International Inc.' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toscointernational.com',
    siteName: 'Tosco International Inc.',
    title: 'Tosco International Inc. — Fine Jewelry',
    description: 'Exquisite fine jewelry crafted with heritage and precision.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tosco International Inc. — Fine Jewelry',
    description: 'Exquisite fine jewelry crafted with heritage and precision.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-ivory text-charcoal antialiased">
        {children}
      </body>
    </html>
  )
}
