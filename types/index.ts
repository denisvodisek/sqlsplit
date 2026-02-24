export interface SplitOptions {
  mode: 'lines' | 'size'
  value: number
}

export interface ParsedSQL {
  header: string
  body: string[]
  footer: string
  rawLines: string[]
}
