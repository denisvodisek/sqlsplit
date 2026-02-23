'use client'

import { Download, FileCode, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import JSZip from 'jszip'

interface SplitResultsProps {
  results: string[]
  outputPrefix: string
}

export function SplitResults({ results, outputPrefix }: SplitResultsProps) {
  const formatSize = (content: string): string => {
    const bytes = new Blob([content]).size
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const downloadFile = (index: number) => {
    const blob = new Blob([results[index]], { type: 'application/sql' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${outputPrefix}_part_${index + 1}.sql`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = async () => {
    const zip = new JSZip()
    results.forEach((content, i) => {
      zip.file(`${outputPrefix}_part_${i + 1}.sql`, content)
    })
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${outputPrefix}_all_parts.zip`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Download your files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {results.map((content, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border bg-muted p-3">
              <div className="flex items-center gap-3">
                <FileCode className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{outputPrefix}_part_{index + 1}.sql</p>
                  <p className="text-sm text-muted-foreground">{formatSize(content)}</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => downloadFile(index)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          ))}
        </div>

        <Button onClick={downloadAll} variant="outline" className="w-full">
          <Archive className="mr-2 h-4 w-4" />
          Download All as ZIP
        </Button>
      </CardContent>
    </Card>
  )
}
