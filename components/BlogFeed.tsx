'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Post } from '@/lib/posts'
import { AdUnit } from '@/components/AdUnit'

interface BlogFeedProps {
  posts: Post[]
}

export function BlogFeed({ posts }: BlogFeedProps) {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(posts.map((post) => post.category)))],
    [posts]
  )
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return posts
    return posts.filter((post) => post.category === activeCategory)
  }, [posts, activeCategory])

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeCategory === category
                ? 'bg-foreground text-background border-foreground'
                : 'bg-white/70 text-muted-foreground border-black/10 hover:text-foreground'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post, index) => (
          <div key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="block group">
              <article className="glass rounded-xl p-5 hover:bg-white/90 transition-colors">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>{post.category}</span>
                  <span className="opacity-50">·</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="font-semibold mb-1.5 group-hover:text-foreground transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground">{post.description}</p>
              </article>
            </Link>

            {(index + 1) % 3 === 0 && index < filteredPosts.length - 1 && (
              <div className="glass rounded-xl p-4 mt-4">
                <p className="text-xs text-muted-foreground/60 mb-2">Advertisement</p>
                <AdUnit slot="5678901234" format="fluid" layout="in-article" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-muted-foreground/60 mb-2">Advertisement</p>
          <AdUnit slot="2345678901" format="horizontal" />
        </div>
      </div>
    </>
  )
}
