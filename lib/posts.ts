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
