import { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { BlogFeed } from '@/components/BlogFeed'

export const metadata: Metadata = {
  title: 'Blog — SQLSplit',
  description: 'Guides for fixing SQL import errors, phpMyAdmin timeouts, and database migration issues.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen relative z-10">
      <AnimatedBackground />

      {/* Header */}
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
              <Link href="/blog" className="text-foreground">Blog</Link>
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
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight mb-3">Blog</h1>
          <p className="text-muted-foreground">
            Guides for SQL import errors and database migration.
          </p>
        </div>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Topics</h2>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              All posts
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/blog/topic/phpmyadmin" className="block group">
              <div className="glass rounded-xl p-5 hover:bg-white/90 transition-colors">
                <p className="text-sm text-muted-foreground mb-1">phpMyAdmin</p>
                <h3 className="font-semibold mb-1.5 group-hover:text-foreground transition-colors">
                  Timeouts and upload limits
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fix import failures and size caps quickly.
                </p>
              </div>
            </Link>
            <Link href="/blog/topic/wordpress" className="block group">
              <div className="glass rounded-xl p-5 hover:bg-white/90 transition-colors">
                <p className="text-sm text-muted-foreground mb-1">WordPress</p>
                <h3 className="font-semibold mb-1.5 group-hover:text-foreground transition-colors">
                  Migrations and big databases
                </h3>
                <p className="text-sm text-muted-foreground">
                  Practical guides for WordPress imports.
                </p>
              </div>
            </Link>
            <Link href="/blog/topic/hosting" className="block group">
              <div className="glass rounded-xl p-5 hover:bg-white/90 transition-colors">
                <p className="text-sm text-muted-foreground mb-1">Hosting</p>
                <h3 className="font-semibold mb-1.5 group-hover:text-foreground transition-colors">
                  Shared hosts and SSH workflows
                </h3>
                <p className="text-sm text-muted-foreground">
                  Workarounds for strict hosting limits.
                </p>
              </div>
            </Link>
          </div>
        </section>

        <BlogFeed posts={posts} />
      </main>

      {/* Footer */}
      <footer className="relative glass-subtle border-t border-black/5 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
            <p>Built because phpMyAdmin kept timing out.</p>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-foreground transition-colors">Tool</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
