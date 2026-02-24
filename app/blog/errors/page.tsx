import { Metadata } from 'next'
import Link from 'next/link'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { getAllErrors } from '@/lib/errors'

export const metadata: Metadata = {
  title: 'SQL Import Error Guides — SQLSplit',
  description: 'Quick fixes for common SQL import errors like timeouts and packet limits.',
}

export default function ErrorIndexPage() {
  const errors = getAllErrors()

  return (
    <div className="min-h-screen relative z-10">
      <AnimatedBackground />

      <header className="relative glass-subtle border-b border-black/5">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-black/5 border border-black/10">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" strokeWidth="1.5">
                <ellipse cx="12" cy="5" rx="7" ry="3" />
                <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
                <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
              </svg>
            </span>
            SQLSplit
          </Link>
          <div className="flex items-center gap-3">
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Tool</Link>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
            </nav>
            <a
              href="https://www.paypal.com/donate/?business=5BKF4C8E2L58W&no_recurring=0&currency_code=USD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-sm"
            >
              Support Me
            </a>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="text-sm text-muted-foreground mb-2">
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <span className="mx-2 opacity-30">/</span>
            <span className="text-foreground">Error guides</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">SQL import error guides</h1>
          <p className="text-muted-foreground">
            Quick, practical fixes for the most common MySQL and phpMyAdmin import errors.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {errors.map((guide) => (
            <Link key={guide.slug} href={`/blog/error/${guide.slug}`} className="block group">
              <article className="glass rounded-xl p-5 hover:bg-white/90 transition-colors">
                <p className="text-xs text-muted-foreground mb-1">Error guide</p>
                <h2 className="font-semibold mb-1.5 group-hover:text-foreground transition-colors">
                  {guide.title}
                </h2>
                <p className="text-sm text-muted-foreground">{guide.description}</p>
              </article>
            </Link>
          ))}
        </div>
      </main>

      <footer className="relative glass-subtle border-t border-black/5 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
            <p>Built because phpMyAdmin kept timing out.</p>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-foreground transition-colors">Tool</Link>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
