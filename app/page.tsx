'use client'

import { SQLSplitter } from '@/lib/sqlsplitter'
import { SplitOptions } from '@/types'
import { FileUpload } from '@/components/FileUpload'
import { SplitOptions as SplitOptionsComponent } from '@/components/SplitOptions'
import { SplitResults } from '@/components/SplitResults'
import { AdUnit } from '@/components/AdUnit'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { useState, useCallback } from 'react'
import pako from 'pako'
import Link from 'next/link'
import {
  Globe,
  Gear,
  Database,
  ShoppingCart,
  Stack,
  ChartBar,
} from 'phosphor-react'

const splitter = new SQLSplitter()

const demoSql = `-- SQLSplit demo (tiny sample)
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

INSERT INTO users (id, name, email) VALUES
(1, 'Ava', 'ava@example.com'),
(2, 'Noah', 'noah@example.com'),
(3, 'Mia', 'mia@example.com');
`

const homePosts = [
  {
    slug: 'mysql-import-error-2006',
    title: 'MySQL Error 2006: Server Has Gone Away (During Import)',
    description:
      "Your import dies with 'MySQL server has gone away'. Here's what's happening and how to fix it.",
    category: 'Troubleshooting',
    readTime: '3 min read',
  },
  {
    slug: 'wordpress-database-too-large',
    title: "WordPress Database Too Large to Import? Here's What to Do",
    description:
      "Migrating WordPress to new hosting but the database export is too big. Practical solutions that actually work.",
    category: 'WordPress',
    readTime: '5 min read',
  },
  {
    slug: 'split-mysqldump-file',
    title: 'How to Split a mysqldump File Into Smaller Parts',
    description:
      "Your mysqldump is too big to handle. Here's how to break it into importable chunks without breaking the SQL.",
    category: 'Tutorial',
    readTime: '4 min read',
  },
]

const useCases = [
  {
    title: 'Website Migration',
    description:
      'Moving WordPress, Drupal, or custom sites? Split dumps to avoid import timeouts and incomplete restores.',
    icon: Globe,
    tone: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Development Setup',
    description:
      'Spin up local dev environments with production data without choking on huge SQL files.',
    icon: Gear,
    tone: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Database Backup',
    description:
      'Create manageable backup chunks for easier storage, transfer, and selective restoration.',
    icon: Database,
    tone: 'bg-violet-50 text-violet-600',
  },
  {
    title: 'E‑commerce Migration',
    description:
      'Handle large WooCommerce or Shopify exports without import failures or broken transactions.',
    icon: ShoppingCart,
    tone: 'bg-amber-50 text-amber-700',
  },
  {
    title: 'Staging Environments',
    description:
      'Deploy realistic staging data without overwhelming server limits or memory.',
    icon: Stack,
    tone: 'bg-rose-50 text-rose-600',
  },
  {
    title: 'Data Analysis',
    description:
      'Split massive datasets into smaller chunks for faster analysis and processing.',
    icon: ChartBar,
    tone: 'bg-sky-50 text-sky-600',
  },
]

const homeFaq = [
  {
    question: 'Do my files upload anywhere?',
    answer: 'No. Everything runs locally in your browser. Your SQL never leaves your device.',
  },
  {
    question: 'Will it break my SQL statements?',
    answer: 'No. It preserves headers, footers, and multi-line statements so imports stay valid.',
  },
  {
    question: 'Can it handle .sql.gz files?',
    answer: 'Yes. Drop a compressed file and it will decompress and split it automatically.',
  },
  {
    question: 'What split size should I use for phpMyAdmin?',
    answer: 'Start with 10–20MB per file. Smaller chunks are more reliable on shared hosting.',
  },
  {
    question: 'Is SQLSplit free to use?',
    answer: 'Yes. The tool is free and runs entirely in your browser.',
  },
  {
    question: 'Does it preserve import order?',
    answer: 'Yes. It keeps statements in order and preserves headers and footers.',
  },
  {
    question: 'Can I rename the output files?',
    answer: 'Yes. Set the output prefix before splitting.',
  },
  {
    question: 'Will this work on huge files?',
    answer: 'It handles large dumps, but extremely large files can hit browser memory limits.',
  },
  {
    question: 'Do I need to install anything?',
    answer: 'No. Just open the site and drop your file.',
  },
]

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<'lines' | 'size'>('lines')
  const [lineCount, setLineCount] = useState(10000)
  const [sizeMB, setSizeMB] = useState(10)
  const [outputPrefix, setOutputPrefix] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<string[]>([])

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    const baseName = selectedFile.name.replace(/\.(sql|gz)$/i, '')
    setOutputPrefix(baseName)
    setResults([])
  }, [])

  const handleClear = useCallback(() => {
    setFile(null)
    setResults([])
    setProgress(0)
  }, [])

  const handleSplit = async (fileOverride?: File) => {
    const activeFile = fileOverride ?? file
    if (!activeFile) return

    setIsProcessing(true)
    setProgress(10)

    try {
      const buffer = await activeFile.arrayBuffer()
      setProgress(30)

      let content: string
      if (activeFile.name.toLowerCase().endsWith('.gz')) {
        const data = new Uint8Array(buffer)
        const blob = new Blob([data])
        let decompressed: string | undefined

        // Try browser's native DecompressionStream first (often more robust)
        if (typeof DecompressionStream !== 'undefined') {
          try {
            const stream = blob.stream().pipeThrough(new DecompressionStream('gzip'))
            const out = await new Response(stream).blob()
            decompressed = await out.text()
          } catch {
            // Fall through to pako
          }
        }

        // Fall back to pako if native failed or unavailable
        if (decompressed === undefined) {
          try {
            decompressed = pako.inflate(data, { to: 'string' })
          } catch {
            try {
              decompressed = pako.inflateRaw(data, { to: 'string' })
            } catch {
              if (typeof DecompressionStream !== 'undefined') {
                try {
                  const stream = blob.stream().pipeThrough(new DecompressionStream('deflate-raw'))
                  const out = await new Response(stream).blob()
                  decompressed = await out.text()
                } catch {
                  // Fall through to error
                }
              }
            }
          }
        }

        if (decompressed === undefined) {
          throw new Error(
            'Could not decompress .gz file. The file may be corrupted, truncated, or use an unsupported compression format. Try exporting as plain .sql instead.'
          )
        }
        content = decompressed
      } else {
        content = new TextDecoder().decode(buffer)
      }
      setProgress(50)

      const options: SplitOptions = {
        mode,
        value: mode === 'lines' ? lineCount : sizeMB,
      }

      const splitResults = splitter.split(content, options)
      setProgress(100)
      setResults(splitResults)
    } catch (error) {
      console.error('Split error:', error)
      alert('Error processing file: ' + (error as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDemo = async () => {
    const demoFile = new File([demoSql], 'sample.sql', { type: 'application/sql' })
    setFile(demoFile)
    setOutputPrefix('sample')
    setResults([])
    await handleSplit(demoFile)
  }

  return (
    <div className="min-h-screen relative z-10">
      <AnimatedBackground />

      {/* Header */}
      <header className="relative glass-subtle border-b border-black/5">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-black/5 border border-black/10">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" strokeWidth="1.5">
                <ellipse cx="12" cy="5" rx="7" ry="3" />
                <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
                <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
              </svg>
            </span>
            SQLSplit
          </Link>
          <div className="flex items-center gap-3">
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="text-foreground">Tool</Link>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
            </nav>
            <a
              href="https://www.paypal.com/donate/?business=5BKF4C8E2L58W&no_recurring=0&currency_code=USD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-sm"
            >
              Support Me
            </a>
          </div>
        </div>
      </header>

      <main className={`relative max-w-5xl mx-auto px-4 py-12 ${results.length > 0 ? 'pb-24' : ''}`}>
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            Split Large SQL Files
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            phpMyAdmin timing out? Drop your file here and break it into smaller, importable chunks.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="px-2.5 py-1 rounded-full bg-white/70 border border-black/5">MySQL</span>
            <span className="px-2.5 py-1 rounded-full bg-white/70 border border-black/5">phpMyAdmin</span>
            <span className="px-2.5 py-1 rounded-full bg-white/70 border border-black/5">WordPress</span>
          </div>
        </div>

        {/* Main Tool Card */}
        <div className="glass rounded-2xl p-6 sm:p-8 space-y-6">
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={file}
            onClear={handleClear}
          />

          {!file && (
            <div className="flex items-center justify-between rounded-xl border border-black/5 bg-white/70 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Try a 10‑second demo</p>
                <p className="text-xs text-muted-foreground">Loads a tiny sample SQL and splits it instantly.</p>
              </div>
              <Button
                onClick={handleDemo}
                className="h-9 px-4 text-sm bg-foreground text-background hover:bg-foreground/90"
              >
                Try sample SQL
              </Button>
            </div>
          )}

          {file && (
            <>
              <div className="border-t border-black/10 pt-6">
                <SplitOptionsComponent
                  mode={mode}
                  onModeChange={setMode}
                  lineCount={lineCount}
                  onLineCountChange={setLineCount}
                  sizeMB={sizeMB}
                  onSizeMBChange={setSizeMB}
                  outputPrefix={outputPrefix}
                  onOutputPrefixChange={setOutputPrefix}
                />
              </div>

              <Button
                onClick={() => handleSplit()}
                disabled={isProcessing}
                className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 font-medium"
              >
                {isProcessing ? 'Splitting...' : 'Split File'}
              </Button>

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-1.5" />
                  <p className="text-sm text-muted-foreground text-center">{progress}%</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-6 space-y-6">
            <div className="glass rounded-2xl overflow-hidden">
              <SplitResults results={results} outputPrefix={outputPrefix} />
            </div>
            
            {/* Ad after successful action */}
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-muted-foreground/60 mb-2">Advertisement</p>
              <AdUnit slot="1234567890" format="horizontal" />
            </div>
          </div>
        )}

        {/* Topics */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Topics</h2>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              All posts
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/blog/topic/phpmyadmin" className="block group">
              <div className="glass rounded-xl p-5 hover:bg-white/90 transition-colors">
                <p className="text-sm text-muted-foreground mb-1">phpMyAdmin</p>
                <h3 className="font-semibold mb-1.5 group-hover:text-foreground transition-colors">
                  Timeouts and upload limits
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fix import failures and size caps quickly.
                </p>
              </div>
            </Link>
            <Link href="/blog/topic/wordpress" className="block group">
              <div className="glass rounded-xl p-5 hover:bg-white/90 transition-colors">
                <p className="text-sm text-muted-foreground mb-1">WordPress</p>
                <h3 className="font-semibold mb-1.5 group-hover:text-foreground transition-colors">
                  Migrations and big databases
                </h3>
                <p className="text-sm text-muted-foreground">
                  Practical guides for WordPress imports.
                </p>
              </div>
            </Link>
            <Link href="/blog/topic/hosting" className="block group">
              <div className="glass rounded-xl p-5 hover:bg-white/90 transition-colors">
                <p className="text-sm text-muted-foreground mb-1">Hosting</p>
                <h3 className="font-semibold mb-1.5 group-hover:text-foreground transition-colors">
                  Shared hosts and SSH workflows
                </h3>
                <p className="text-sm text-muted-foreground">
                  Workarounds for strict hosting limits.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Blog Section */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Latest from the blog</h2>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {homePosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <article className="glass rounded-xl p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>{post.category}</span>
                    <span className="opacity-50">·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-semibold mb-1.5 group-hover:text-foreground transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{post.description}</p>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Common use cases</h2>
            <p className="text-muted-foreground">
              Built for migrations, imports, and workflows that break on large SQL files.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => {
              const Icon = useCase.icon
              return (
                <div key={useCase.title} className="glass rounded-2xl p-5">
                  <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${useCase.tone}`}>
                    <Icon size={18} weight="duotone" />
                  </div>
                  <h3 className="font-semibold mt-4 mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Trust Section */}
        <div className="mt-16 space-y-8">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold mb-5">How it works</h2>
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center">
              <div className="rounded-xl border border-black/5 bg-white/70 p-4">
                <div className="text-xs font-medium text-muted-foreground mb-2">Step 01</div>
                <p className="font-semibold mb-1">Drop your file</p>
                <p className="text-sm text-muted-foreground">
                  Your SQL stays local. Nothing leaves your browser.
                </p>
              </div>
              <div className="hidden md:flex items-center justify-center text-muted-foreground/60 text-xl">→</div>
              <div className="rounded-xl border border-black/5 bg-white/70 p-4">
                <div className="text-xs font-medium text-muted-foreground mb-2">Step 02</div>
                <p className="font-semibold mb-1">Choose the split rule</p>
                <p className="text-sm text-muted-foreground">
                  Split by lines or size without breaking SQL structure.
                </p>
              </div>
              <div className="hidden md:flex items-center justify-center text-muted-foreground/60 text-xl">→</div>
              <div className="rounded-xl border border-black/5 bg-white/70 p-4">
                <div className="text-xs font-medium text-muted-foreground mb-2">Step 03</div>
                <p className="font-semibold mb-1">Download and import</p>
                <p className="text-sm text-muted-foreground">
                  Grab clean chunks and import without timeouts.
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Works with <span className="font-medium text-foreground">.sql</span> and{' '}
              <span className="font-medium text-foreground">.sql.gz</span> files.
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
              <div className="rounded-2xl border border-black/5 bg-white/80 p-5">
                <p className="text-xs text-muted-foreground mb-2">Root causes</p>
                <h2 className="text-xl font-semibold mb-3">Why imports fail</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Most failures come down to time limits, packet limits, or giant statements. Split first to
                  keep each import small and reliable.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-black/5 text-muted-foreground">Timeouts</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-black/5 text-muted-foreground">Packet limits</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-black/5 text-muted-foreground">Upload caps</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-black/5 text-muted-foreground">Huge INSERTs</span>
                </div>
                <Link href="/blog" className="inline-flex text-sm font-medium text-foreground hover:underline">
                  Read fixes →
                </Link>
              </div>
              <div className="space-y-3">
                <Link href="/blog/phpmyadmin-import-timeout" className="block group">
                  <div className="flex gap-3 rounded-xl border border-black/5 bg-white/70 p-4 hover:bg-white/90 transition-colors">
                    <span className="text-xs font-semibold text-muted-foreground">01</span>
                    <div>
                      <p className="font-medium mb-1 group-hover:text-foreground transition-colors">
                        phpMyAdmin scripts time out
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Long imports exceed execution limits on shared hosting.
                      </p>
                    </div>
                  </div>
                </Link>
                <Link href="/blog/mysql-max-allowed-packet" className="block group">
                  <div className="flex gap-3 rounded-xl border border-black/5 bg-white/70 p-4 hover:bg-white/90 transition-colors">
                    <span className="text-xs font-semibold text-muted-foreground">02</span>
                    <div>
                      <p className="font-medium mb-1 group-hover:text-foreground transition-colors">
                        max_allowed_packet errors
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Oversized INSERT statements crash the import.
                      </p>
                    </div>
                  </div>
                </Link>
                <Link href="/blog/phpmyadmin-upload-limit" className="block group">
                  <div className="flex gap-3 rounded-xl border border-black/5 bg-white/70 p-4 hover:bg-white/90 transition-colors">
                    <span className="text-xs font-semibold text-muted-foreground">03</span>
                    <div>
                      <p className="font-medium mb-1 group-hover:text-foreground transition-colors">
                        Upload limits block large dumps
                      </p>
                      <p className="text-sm text-muted-foreground">
                        phpMyAdmin stops the import before it starts.
                      </p>
                    </div>
                  </div>
                </Link>
                <Link href="/blog/sql-import-hangs" className="block group">
                  <div className="flex gap-3 rounded-xl border border-black/5 bg-white/70 p-4 hover:bg-white/90 transition-colors">
                    <span className="text-xs font-semibold text-muted-foreground">04</span>
                    <div>
                      <p className="font-medium mb-1 group-hover:text-foreground transition-colors">
                        Imports hang or crash
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Huge statements and timeouts freeze progress.
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold mb-4">FAQ</h2>
            <Accordion type="single" collapsible className="w-full">
              {homeFaq.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Secondary Ad */}
          <div className="glass rounded-xl p-4">
            <p className="text-xs text-muted-foreground/60 mb-2">Advertisement</p>
            <AdUnit slot="7285338195" format="auto" />
          </div>
        </div>
      </main>

      {results.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(720px,94vw)]">
          <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between border border-black/5">
            <p className="text-sm text-muted-foreground">
              Need another split? Drop a new file and go again.
            </p>
            <Button
              onClick={() => {
                handleClear()
                document.getElementById('file-input')?.click()
              }}
              className="h-9 px-4 text-sm bg-foreground text-background hover:bg-foreground/90"
            >
              Split another file
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative glass-subtle border-t border-black/5 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
            <p>Built because phpMyAdmin kept timing out.</p>
            <div className="flex gap-4">
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
