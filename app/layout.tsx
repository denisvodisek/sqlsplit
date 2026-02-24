import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { generateOrganizationSchema, generateWebApplicationSchema } from '@/lib/schema'
import { CursorGlow } from '@/components/CursorGlow'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  title: 'SQLSplit — Split Large SQL Files for Import',
  description: 'Split large SQL database dumps into smaller files. Fix phpMyAdmin timeouts and MySQL import errors. Free, runs in your browser, no upload needed.',
  metadataBase: new URL('https://sqlsplit.com'),
  keywords: ['split SQL file', 'phpMyAdmin timeout', 'MySQL import error', 'large SQL file', 'database migration', 'split mysqldump'],
  authors: [{ name: 'SQLSplit' }],
  openGraph: {
    title: 'SQLSplit — Split Large SQL Files for Import',
    description: 'Split large SQL database dumps into smaller files. Fix phpMyAdmin timeouts and import errors.',
    url: 'https://sqlsplit.com',
    siteName: 'SQLSplit',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'SQLSplit — Split Large SQL Files',
    description: 'Fix phpMyAdmin timeouts. Split your SQL dump into importable chunks.',
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
    <html lang="en">
      <head>
        <link rel="canonical" href="https://sqlsplit.com" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
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
      <body className={`${manrope.variable}`}>
        <CursorGlow />
        {children}
      </body>
    </html>
  )
}
