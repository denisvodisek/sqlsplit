import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { PostContent } from '@/components/PostContent'
import { getPostBySlug, getAllSlugs } from '@/lib/posts'
import { generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema'

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Generate metadata for each post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Not Found',
    }
  }

  return {
    title: `${post.title} — SQLSplit Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Generate schemas
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-xl font-bold">
              SQLSplit
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Tools
              </Link>
              <Link href="/blog" className="text-sm font-medium">
                Blog
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <article className="lg:col-span-2 max-w-none">
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/" className="hover:text-foreground">Home</Link>
                  </li>
                  <li>/</li>
                  <li>
                    <Link href="/blog" className="hover:text-foreground">Blog</Link>
                  </li>
                  <li>/</li>
                  <li aria-current="page" className="text-foreground">{post.title}</li>
                </ol>
              </nav>

              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>{post.category}</span>
                  <span>•</span>
                  <time dateTime={post.date}>{post.date}</time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <p className="text-muted-foreground">By {post.author}</p>
                <div className="flex gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <PostContent content={post.content} />
            </article>

            <Sidebar />
          </div>
        </main>
      </div>
    </>
  )
}
