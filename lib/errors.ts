import fs from 'fs'
import path from 'path'

export interface ErrorGuide {
  slug: string
  title: string
  description: string
  causes: string[]
  fixes: string[]
  related: string[]
}

const errorsDirectory = path.join(process.cwd(), 'content/errors')

export function getAllErrorSlugs(): string[] {
  const fileNames = fs.readdirSync(errorsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => fileName.replace(/\.json$/, ''))
}

export function getErrorBySlug(slug: string): ErrorGuide | null {
  try {
    const fullPath = path.join(errorsDirectory, `${slug}.json`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const guide: ErrorGuide = JSON.parse(fileContents)
    return guide
  } catch (error) {
    return null
  }
}

export function getAllErrors(): ErrorGuide[] {
  const fileNames = fs.readdirSync(errorsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(errorsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      return JSON.parse(fileContents) as ErrorGuide
    })
}
