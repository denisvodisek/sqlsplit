import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { getAllErrorSlugs, getErrorBySlug } from '@/lib/errors'
import { getPostBySlug } from '@/lib/posts'
import { generateFAQSchema } from '@/lib/schema'

export function generateStaticParams() {
  return getAllErrorSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = getErrorBySlug(params.slug)
  if (!guide) {
    return { title: 'Not Found' }
  }
  return {
    title: `${guide.title} — SQLSplit`,
    description: guide.description,
  }
}

export default function ErrorGuidePage({ params }: { params: { slug: string } }) {
  const guide = getErrorBySlug(params.slug)

  if (!guide) {
    notFound()
  }

  const relatedPosts = guide.related
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is NonNullable<typeof post> => Boolean(post))

  const faqSchema = generateFAQSchema({
    questions: [
      {
        question: `What causes ${guide.title}?`,
        answer: guide.causes.join(' '),
      },
      {
        question: `How do I fix ${guide.title}?`,
        answer: guide.fixes.join(' '),
      },
    ],
  })

  return (
    <div className="min-h-screen relative z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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

      <main className="relative max-w-5xl mx-auto px-4 py-10">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <span className="mx-2 opacity-30">/</span>
          <span className="text-foreground">Error guides</span>
        </nav>

        <article className="glass rounded-2xl p-6 sm:p-8">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">{guide.title}</h1>
            <p className="text-muted-foreground">{guide.description}</p>
          </header>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="font-semibold mb-3">Common causes</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {guide.causes.map((cause) => (
                  <li key={cause}>• {cause}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-semibold mb-3">Best fixes</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {guide.fixes.map((fix) => (
                  <li key={fix}>• {fix}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-black/5 bg-white/70 p-4">
            <p className="font-medium mb-1">Quick fix</p>
            <p className="text-sm text-muted-foreground">
              Split the dump into smaller parts to reduce statement size and import time.
            </p>
            <Link
              href="/"
              className="inline-block mt-3 text-sm font-medium bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors"
            >
              Open SQLSplit
            </Link>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-8">
            <h2 className="font-semibold mb-4">Related guides</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                  <article className="glass rounded-xl p-5 hover:bg-white/90 transition-colors">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{post.category}</span>
                      <span className="opacity-30">·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-semibold mb-1.5 group-hover:text-foreground transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{post.description}</p>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
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
