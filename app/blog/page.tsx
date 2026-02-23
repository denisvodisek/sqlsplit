import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Blog — SQLSplit',
  description: 'Tutorials and guides for SQL database management, migration, and optimization.',
}

interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
}

const posts: Post[] = [
  {
    slug: 'fix-phpmyadmin-import-timeout',
    title: 'How to Fix phpMyAdmin Import Timeout (The Complete Guide)',
    excerpt: 'Learn why phpMyAdmin times out and 4 proven methods to fix it, including splitting large SQL files.',
    date: '2025-02-23',
    readTime: '12 min read',
    category: 'Troubleshooting',
  },
  {
    slug: 'mysql-command-line-vs-phpmyadmin',
    title: 'MySQL Command Line Import vs phpMyAdmin: Which is Better?',
    excerpt: 'A detailed comparison of importing MySQL databases via command line versus phpMyAdmin.',
    date: '2025-02-20',
    readTime: '8 min read',
    category: 'Comparison',
  },
  {
    slug: 'wordpress-database-migration-guide',
    title: 'WordPress Database Migration: The Definitive 2025 Guide',
    excerpt: 'Everything you need to know about migrating WordPress databases without breaking your site.',
    date: '2025-02-15',
    readTime: '15 min read',
    category: 'WordPress',
  },
]

export default function BlogPage() {
  return (
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

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Tutorials and guides for SQL database management, migration, and optimization.
          </p>

          <div className="space-y-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
