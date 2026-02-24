import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostContent } from '@/components/PostContent'
import { AdUnit } from '@/components/AdUnit'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { getPostBySlug, getAllSlugs, getRelatedPosts } from '@/lib/posts'
import { generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema'

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return { title: 'Not Found' }
  }

  return {
    title: `${post.title} — SQLSplit`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.description,
    slug: post.slug,
    datePublished: post.date,
    author: post.author,
  })

  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      { name: 'Home', url: 'https://sqlsplit.com/' },
      { name: 'Blog', url: 'https://sqlsplit.com/blog' },
      { name: post.title, url: `https://sqlsplit.com/blog/${post.slug}` },
    ],
  })

  const faqSchema = generateFAQSchema({
    questions: post.faq,
  })

  const relatedPosts = getRelatedPosts(post, 4)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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

        <main className="relative max-w-5xl mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-2 opacity-30">/</span>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <span className="mx-2 opacity-30">/</span>
            <span className="text-foreground">{post.title}</span>
          </nav>

          <article className="glass rounded-2xl p-6 sm:p-8">
            {/* Header */}
            <header className="mb-8 pb-8 border-b border-black/10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span>{post.category}</span>
                <span className="opacity-30">·</span>
                <time dateTime={post.date}>{post.date}</time>
                <span className="opacity-30">·</span>
                <span>{post.readTime}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">{post.title}</h1>
              <p className="text-muted-foreground">{post.description}</p>
            </header>

            {/* Content */}
            <div className="prose">
              <PostContent content={post.content} />
            </div>

            {/* FAQ Section */}
            {post.faq && post.faq.length > 0 && (
              <section className="mt-10 pt-8 border-t border-black/10">
                <h2 className="font-semibold mb-5">Frequently Asked Questions</h2>
                <div className="space-y-5">
                  {post.faq.map((item, index) => (
                    <div key={index}>
                      <h3 className="font-medium mb-1.5">{item.question}</h3>
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>

          {relatedPosts.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Related articles</h2>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  View all
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedPosts.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} className="block group">
                    <article className="glass rounded-xl p-5 hover:bg-white/90 transition-colors">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>{related.category}</span>
                        <span className="opacity-30">·</span>
                        <span>{related.readTime}</span>
                      </div>
                      <h3 className="font-semibold mb-1.5 group-hover:text-foreground transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{related.description}</p>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Ad after article */}
          <div className="mt-6">
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-muted-foreground/60 mb-2">Advertisement</p>
              <AdUnit slot="9876543210" format="horizontal" />
            </div>
          </div>
        </main>

        {/* Footer */}
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
    </>
  )
}
