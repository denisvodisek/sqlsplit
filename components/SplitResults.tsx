'use client'

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
    a.download = `${outputPrefix}_split.zip`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="px-6 py-4 border-b border-black/10 bg-emerald-500/10">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-medium">
            Done — {results.length} file{results.length > 1 ? 's' : ''} ready
          </p>
        </div>
      </div>
      
      <div className="divide-y divide-black/5 max-h-[280px] overflow-y-auto">
        {results.map((content, index) => (
          <div key={index} className="flex items-center justify-between px-6 py-3 hover:bg-black/5 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-5">{index + 1}</span>
              <span className="text-sm font-mono">{outputPrefix}_part_{index + 1}.sql</span>
              <span className="text-xs text-muted-foreground">{formatSize(content)}</span>
            </div>
            <button 
              onClick={() => downloadFile(index)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Download
            </button>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-black/10">
        <button
          onClick={downloadAll}
          className="w-full h-10 rounded-lg border border-black/10 bg-black/5 hover:bg-black/10 text-sm font-medium transition-colors"
        >
          Download all as ZIP
        </button>
      </div>
    </>
  )
}
