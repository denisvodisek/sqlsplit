'use client'

import { SQLSplitter } from '@/lib/sqlsplitter'
import { SplitOptions } from '@/types'
import { FileUpload } from '@/components/FileUpload'
import { SplitOptions as SplitOptionsComponent } from '@/components/SplitOptions'
import { SplitResults } from '@/components/SplitResults'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Scissors } from 'lucide-react'
import { useState, useCallback } from 'react'
import pako from 'pako'

const splitter = new SQLSplitter()

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

  const handleSplit = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(10)

    try {
      const buffer = await file.arrayBuffer()
      setProgress(30)

      let content: string
      if (file.name.toLowerCase().endsWith('.gz')) {
        content = pako.inflate(new Uint8Array(buffer), { to: 'string' })
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SQLSplit</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-foreground">Tools</a>
            <a href="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">SQL File Splitter</CardTitle>
                <CardDescription>
                  Split large SQL dumps into manageable chunks. Runs entirely in your browser.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Upload your SQL file</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  selectedFile={file}
                  onClear={handleClear}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Split options</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            <Button
              onClick={handleSplit}
              disabled={!file || isProcessing}
              className="w-full"
              size="lg"
            >
              <Scissors className="mr-2 h-5 w-5" />
              {isProcessing ? 'Processing...' : 'Split File'}
            </Button>

            {isProcessing && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Processing...</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </CardContent>
              </Card>
            )}

            {results.length > 0 && (
              <SplitResults results={results} outputPrefix={outputPrefix} />
            )}
          </div>

          <Sidebar />
        </div>
      </main>
    </div>
  )
}
