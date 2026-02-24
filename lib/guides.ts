import fs from 'fs'
import path from 'path'

export interface Guide {
  slug: string
  title: string
  description: string
  bullets: string[]
  related: string[]
}

const guidesDirectory = path.join(process.cwd(), 'content/guides')

export function getAllGuideSlugs(): string[] {
  const fileNames = fs.readdirSync(guidesDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => fileName.replace(/\.json$/, ''))
}

export function getGuideBySlug(slug: string): Guide | null {
  try {
    const fullPath = path.join(guidesDirectory, `${slug}.json`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    return JSON.parse(fileContents) as Guide
  } catch (error) {
    return null
  }
}

export function getAllGuides(): Guide[] {
  const fileNames = fs.readdirSync(guidesDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(guidesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      return JSON.parse(fileContents) as Guide
    })
}
