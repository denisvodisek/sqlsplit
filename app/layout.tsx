import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { generateOrganizationSchema, generateWebApplicationSchema } from '@/lib/schema'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SQLSplit — Split Large SQL Files Online',
  description: 'Split large SQL dumps into manageable chunks. Browser-based, 100% private, no uploads.',
  metadataBase: new URL('https://sqlsplit.com'),
  keywords: ['SQL splitter', 'database migration', 'phpMyAdmin timeout', 'MySQL import', 'SQL file split'],
  authors: [{ name: 'SQLSplit' }],
  openGraph: {
    title: 'SQLSplit — Split Large SQL Files Online',
    description: 'Split large SQL dumps into manageable chunks. Browser-based, 100% private.',
    url: 'https://sqlsplit.com',
    siteName: 'SQLSplit',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SQLSplit — Split Large SQL Files Online',
    description: 'Split large SQL dumps into manageable chunks. Browser-based, 100% private.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = generateOrganizationSchema()
  const webAppSchema = generateWebApplicationSchema()

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4524750683541633" crossOrigin="anonymous"></script>
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webAppSchema),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
