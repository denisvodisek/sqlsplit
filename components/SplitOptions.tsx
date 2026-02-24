'use client'

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
    <div className="space-y-5">
      {/* Mode Toggle */}
      <div>
        <label className="text-sm font-medium mb-3 block">Split by</label>
        <div className="inline-flex rounded-lg bg-black/5 p-1 border border-black/10">
          <button
            onClick={() => onModeChange('lines')}
            className={`px-4 py-2 text-sm rounded-md transition-all ${
              mode === 'lines'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Lines
          </button>
          <button
            onClick={() => onModeChange('size')}
            className={`px-4 py-2 text-sm rounded-md transition-all ${
              mode === 'size'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            File size
          </button>
        </div>
      </div>

      {/* Value Input */}
      {mode === 'lines' ? (
        <div>
          <label className="text-sm font-medium mb-2 block">Lines per file</label>
          <input
            type="number"
            value={lineCount}
            onChange={(e) => onLineCountChange(parseInt(e.target.value) || 1000)}
            min={1000}
            className="w-[180px] h-10 px-3 rounded-lg bg-white border border-black/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-black/20 focus:bg-white transition-colors"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            10,000 lines works for most setups
          </p>
        </div>
      ) : (
        <div>
          <label className="text-sm font-medium mb-2 block">MB per file</label>
          <input
            type="number"
            value={sizeMB}
            onChange={(e) => onSizeMBChange(parseInt(e.target.value) || 1)}
            min={1}
            className="w-[180px] h-10 px-3 rounded-lg bg-white border border-black/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-black/20 focus:bg-white transition-colors"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            10MB for phpMyAdmin, 50MB for CLI
          </p>
        </div>
      )}

      {/* Output Prefix */}
      <div>
        <label className="text-sm font-medium mb-2 block">Output filename</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={outputPrefix}
            onChange={(e) => onOutputPrefixChange(e.target.value)}
            placeholder="database"
            className="w-[180px] h-10 px-3 rounded-lg bg-white border border-black/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-black/20 focus:bg-white transition-colors"
          />
          <span className="text-sm text-muted-foreground">_part_1.sql</span>
        </div>
      </div>
    </div>
  )
}
