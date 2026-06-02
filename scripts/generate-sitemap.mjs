#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from the content/ JSON files and the static
 * blog routes. Run automatically after every build (see package.json), or
 * manually with `npm run sitemap`.
 *
 * Adding a new JSON file under content/{posts,guides,hosts,errors,tools}
 * is all it takes — the URL shows up in the sitemap on the next build.
 * No more hand-editing sitemap.xml.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const contentDir = path.join(root, 'content')

const BASE_URL = 'https://www.sqlsplit.com'

// Topic hubs are hard-coded in lib/posts.ts (topicConfigs), mirror them here.
const TOPICS = ['phpmyadmin', 'wordpress', 'hosting']

function readJsonDir(dir) {
  const full = path.join(contentDir, dir)
  if (!fs.existsSync(full)) return []
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const data = JSON.parse(fs.readFileSync(path.join(full, f), 'utf8'))
      const slug = f.replace(/\.json$/, '')
      // Posts carry their own date; everything else falls back to file mtime.
      const stat = fs.statSync(path.join(full, f))
      const lastmod = (data.date || stat.mtime.toISOString()).slice(0, 10)
      return { slug, lastmod }
    })
}

const today = new Date().toISOString().slice(0, 10)

const posts = readJsonDir('posts')
const guides = readJsonDir('guides')
const hosts = readJsonDir('hosts')
const errors = readJsonDir('errors')
const tools = readJsonDir('tools')

/** @type {{loc: string, lastmod: string, priority: string, changefreq: string}[]} */
const urls = []

const push = (loc, lastmod, priority = '0.7', changefreq = 'monthly') =>
  urls.push({ loc, lastmod, priority, changefreq })

// Core pages
push(`${BASE_URL}/`, today, '1.0', 'weekly')
push(`${BASE_URL}/blog`, today, '0.9', 'daily')

// Section index pages
push(`${BASE_URL}/blog/guides`, today, '0.7', 'weekly')
push(`${BASE_URL}/blog/tools`, today, '0.7', 'weekly')
push(`${BASE_URL}/blog/hosts`, today, '0.7', 'weekly')
push(`${BASE_URL}/blog/errors`, today, '0.7', 'weekly')

// Topic hubs
for (const topic of TOPICS) push(`${BASE_URL}/blog/topic/${topic}`, today, '0.6')

// Programmatic detail pages
for (const g of guides) push(`${BASE_URL}/blog/guides/${g.slug}`, g.lastmod, '0.7')
for (const t of tools) push(`${BASE_URL}/blog/tool/${t.slug}`, t.lastmod, '0.7')
for (const h of hosts) push(`${BASE_URL}/blog/host/${h.slug}`, h.lastmod, '0.7')
for (const e of errors) push(`${BASE_URL}/blog/error/${e.slug}`, e.lastmod, '0.7')

// Blog posts (highest count, the SEO workhorses)
for (const p of posts) push(`${BASE_URL}/blog/${p.slug}`, p.lastmod, '0.8')

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls
    .map(
      (u) =>
        '  <url>\n' +
        `    <loc>${u.loc}</loc>\n` +
        `    <lastmod>${u.lastmod}</lastmod>\n` +
        `    <changefreq>${u.changefreq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        '  </url>'
    )
    .join('\n') +
  '\n</urlset>\n'

// The site deploys with Next.js server output, which serves files from
// public/ at the site root — same as public/robots.txt. So that's the one
// canonical sitemap to write.
const sitemapPath = path.join(root, 'public', 'sitemap.xml')
fs.writeFileSync(sitemapPath, xml)
console.log(`sitemap: wrote ${urls.length} urls -> ${path.relative(root, sitemapPath)}`)

// llms.txt — the AI-crawler index. Same content, plain-text list. Generating
// it here means it can never drift out of sync with the sitemap again.
const llms =
  `# SQLSplit

## What this site is
SQLSplit is a browser-based tool that splits large SQL dump files into smaller chunks for reliable import. It runs fully client-side and never uploads files.

## Primary actions
- Split .sql or .sql.gz files by line count or target file size
- Download split parts individually or as a ZIP

## Key pages
` +
  urls.map((u) => `- ${u.loc}`).join('\n') +
  `

## Data handling
- Files are processed locally in the browser
- No uploads or server storage

## Contact
- https://github.com/denisvodisek/sqlsplit
`

const llmsPath = path.join(root, 'public', 'llms.txt')
fs.writeFileSync(llmsPath, llms)
console.log(`llms.txt: wrote ${urls.length} urls -> ${path.relative(root, llmsPath)}`)
