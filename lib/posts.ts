import fs from 'fs'
import path from 'path'

export interface PostContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'code' | 'table' | 'callout' | 'cta'
  variant?: string
  level?: number
  text?: string
  language?: string
  style?: 'ordered' | 'unordered'
  items?: string[]
  headers?: string[]
  rows?: string[][]
  title?: string
  buttonText?: string
  buttonLink?: string
}

export interface PostFAQ {
  question: string
  answer: string
}

export interface Post {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  author: string
  category: string
  tags: string[]
  featured: boolean
  content: PostContentBlock[]
  faq: PostFAQ[]
}

export type TopicKey = 'phpmyadmin' | 'wordpress' | 'hosting'

export const topicConfigs: Record<TopicKey, { title: string; description: string }> = {
  phpmyadmin: {
    title: 'phpMyAdmin',
    description: 'Timeouts, upload limits, and import fixes for phpMyAdmin.',
  },
  wordpress: {
    title: 'WordPress',
    description: 'Database migration and import guides for WordPress sites.',
  },
  hosting: {
    title: 'Hosting',
    description: 'Shared hosting limits, SSH imports, and provider workflows.',
  },
}

const postsDirectory = path.join(process.cwd(), 'content/posts')

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const post: Post = JSON.parse(fileContents)
      return post
    })
  
  // Sort by date, newest first
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.json`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const post: Post = JSON.parse(fileContents)
    return post
  } catch (error) {
    return null
  }
}

export function getAllSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => fileName.replace(/\.json$/, ''))
}

export function getRelatedPosts(post: Post, limit = 4): Post[] {
  const allPosts = getAllPosts().filter((item) => item.slug !== post.slug)

  const scored = allPosts.map((item) => {
    const sharedTags = item.tags.filter((tag) => post.tags.includes(tag)).length
    const sameCategory = item.category === post.category ? 1 : 0
    const score = sharedTags * 2 + sameCategory
    return { item, score }
  })

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return new Date(b.item.date).getTime() - new Date(a.item.date).getTime()
    })
    .slice(0, limit)
    .map(({ item }) => item)
}

export function getPostsByTopic(topic: TopicKey): Post[] {
  const posts = getAllPosts()
  const normalized = (value: string) => value.toLowerCase()

  if (topic === 'phpmyadmin') {
    return posts.filter((post) =>
      post.tags.some((tag) => normalized(tag) === 'phpmyadmin')
    )
  }

  if (topic === 'wordpress') {
    return posts.filter((post) => normalized(post.category) === 'wordpress')
  }

  return posts.filter((post) => normalized(post.category) === 'hosting')
}
