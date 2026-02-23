'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'

interface SplitOptionsProps {
  mode: 'lines' | 'size'
  onModeChange: (mode: 'lines' | 'size') => void
  lineCount: number
  onLineCountChange: (value: number) => void
  sizeMB: number
  onSizeMBChange: (value: number) => void
  outputPrefix: string
  onOutputPrefixChange: (value: string) => void
}

export function SplitOptions({
  mode,
  onModeChange,
  lineCount,
  onLineCountChange,
  sizeMB,
  onSizeMBChange,
  outputPrefix,
  onOutputPrefixChange,
}: SplitOptionsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
        <button
          onClick={() => onModeChange('lines')}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === 'lines' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          By Lines
        </button>
        <button
          onClick={() => onModeChange('size')}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === 'size' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          By Size
        </button>
      </div>

      {mode === 'lines' ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">Lines per file</label>
          <Input
            type="number"
            value={lineCount}
            onChange={(e) => onLineCountChange(parseInt(e.target.value) || 1000)}
            min={1000}
          />
          <p className="text-xs text-muted-foreground">Minimum 1,000 lines. Recommended: 10,000 for most imports.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium">Size per file (MB)</label>
          <Input
            type="number"
            value={sizeMB}
            onChange={(e) => onSizeMBChange(parseInt(e.target.value) || 1)}
            min={1}
          />
          <p className="text-xs text-muted-foreground">Recommended: 10MB for phpMyAdmin, 50MB for command line.</p>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Output filename prefix</label>
        <Input
          type="text"
          value={outputPrefix}
          onChange={(e) => onOutputPrefixChange(e.target.value)}
          placeholder="my_database_dump"
        />
      </div>
    </div>
  )
}
