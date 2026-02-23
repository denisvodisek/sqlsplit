import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Blog — SQLSplit',
  description: 'Tutorials and guides for SQL database management, migration, and optimization.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold">
            SQLSplit
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground">Tools</a>
            <a href="/blog" className="text-sm font-medium">Blog</a>
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
                    <p className="text-muted-foreground">{post.description}</p>
                    <div className="flex gap-2 mt-4">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
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
