import fs from 'fs'
import path from 'path'

export interface HostGuide {
  slug: string
  title: string
  description: string
  limits: string[]
  bestFixes: string[]
  related: string[]
}

const hostsDirectory = path.join(process.cwd(), 'content/hosts')

export function getAllHostSlugs(): string[] {
  const fileNames = fs.readdirSync(hostsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => fileName.replace(/\.json$/, ''))
}

export function getHostBySlug(slug: string): HostGuide | null {
  try {
    const fullPath = path.join(hostsDirectory, `${slug}.json`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    return JSON.parse(fileContents) as HostGuide
  } catch (error) {
    return null
  }
}

export function getAllHosts(): HostGuide[] {
  const fileNames = fs.readdirSync(hostsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(hostsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      return JSON.parse(fileContents) as HostGuide
    })
}
