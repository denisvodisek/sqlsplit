import fs from 'fs'
import path from 'path'

export interface ToolGuide {
  slug: string
  title: string
  description: string
  bestFor: string[]
  limits: string[]
  related: string[]
}

const toolsDirectory = path.join(process.cwd(), 'content/tools')

export function getAllToolSlugs(): string[] {
  const fileNames = fs.readdirSync(toolsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => fileName.replace(/\.json$/, ''))
}

export function getToolBySlug(slug: string): ToolGuide | null {
  try {
    const fullPath = path.join(toolsDirectory, `${slug}.json`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    return JSON.parse(fileContents) as ToolGuide
  } catch (error) {
    return null
  }
}

export function getAllTools(): ToolGuide[] {
  const fileNames = fs.readdirSync(toolsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(toolsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      return JSON.parse(fileContents) as ToolGuide
    })
}
