import { SplitOptions, ParsedSQL } from '@/types'

export class SQLSplitter {
  private headerPatterns: RegExp[] = [
    /^SET\s+/i,
    /^\/\*!/,
    /^\/\*/,
    /^--/,
    /^CREATE\s+DATABASE/i,
    /^USE\s+/i,
    /^DROP\s+DATABASE/i,
    /^CREATE\s+TABLE/i,
    /^LOCK\s+TABLES/i,
    /^UNLOCK\s+TABLES/i,
    /^\/\*M!\d+/,
    /^\s*$/
  ]

  private footerPatterns: RegExp[] = [
    /^\/\*!/,
    /^\/\*/,
    /^--/,
    /dump\s+completed/i,
    /completed\s+on/i,
    /^\s*$/
  ]

  private problematicSetStatements: string[] = [
    '@OLD_CHARACTER_SET_CLIENT',
    '@OLD_CHARACTER_SET_RESULTS',
    '@OLD_COLLATION_CONNECTION',
    'CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT',
    'CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS',
    'COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION'
  ]

  parse(content: string): ParsedSQL {
    const lines = content.split('\n')
    const header = this.extractHeader(lines)
    const footer = this.extractFooter(lines)
    const body = this.extractBody(lines, header.endIndex, footer.startIndex)

    return { header: header.content, body, footer: footer.content, rawLines: lines }
  }

  private extractHeader(lines: string[]): { content: string; endIndex: number; rawLines: string[] } {
    const headerLines: string[] = []
    let i = 0
    let consecutiveNonHeader = 0
    const maxConsecutiveNonHeader = 3

    for (; i < lines.length && i < 200; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      const isHeaderLine = this.headerPatterns.some(pattern => pattern.test(trimmed))

      if (isHeaderLine) {
        headerLines.push(line)
        consecutiveNonHeader = 0
      } else if (headerLines.length > 0 && consecutiveNonHeader < maxConsecutiveNonHeader) {
        headerLines.push(line)
        consecutiveNonHeader++
      } else if (headerLines.length > 0) {
        break
      }
    }

    const cleanHeader = headerLines.filter(line => 
      !this.problematicSetStatements.some(problem => line.includes(problem))
    )

    return {
      content: cleanHeader.join('\n'),
      endIndex: i,
      rawLines: headerLines
    }
  }

  private extractFooter(lines: string[]): { content: string; startIndex: number } {
    const footerLines: string[] = []
    let i = lines.length - 1

    for (; i >= Math.max(0, lines.length - 100); i--) {
      const line = lines[i]
      const trimmed = line.trim()

      const isFooterLine = this.footerPatterns.some(pattern => pattern.test(trimmed))

      if (isFooterLine) {
        footerLines.unshift(line)
      } else if (footerLines.length > 0) {
        break
      }
    }

    return {
      content: footerLines.join('\n'),
      startIndex: i + 1
    }
  }

  private extractBody(lines: string[], headerEnd: number, footerStart: number): string[] {
    return lines.slice(headerEnd, footerStart)
  }

  splitByLines(bodyLines: string[], maxLines: number): string[][] {
    const chunks: string[][] = []
    let currentChunk: string[] = []
    let statementBuffer: string[] = []
    let inMultiLineStatement = false

    for (let i = 0; i < bodyLines.length; i++) {
      const line = bodyLines[i]
      const trimmed = line.trim()

      const openParens = (line.match(/\(/g) || []).length
      const closeParens = (line.match(/\)/g) || []).length
      const hasSemicolon = trimmed.endsWith(';')

      if (!inMultiLineStatement && openParens > closeParens) {
        inMultiLineStatement = true
      }

      statementBuffer.push(line)

      if (inMultiLineStatement && openParens <= closeParens && hasSemicolon) {
        inMultiLineStatement = false
      }

      const canSplit = hasSemicolon && !inMultiLineStatement

      if (canSplit || i === bodyLines.length - 1) {
        currentChunk.push(...statementBuffer)
        statementBuffer = []

        if (currentChunk.length >= maxLines && canSplit) {
          chunks.push([...currentChunk])
          currentChunk = []
        }
      }
    }

    if (currentChunk.length > 0 || statementBuffer.length > 0) {
      chunks.push([...currentChunk, ...statementBuffer])
    }

    return chunks
  }

  splitBySize(bodyLines: string[], maxBytes: number): string[][] {
    const chunks: string[][] = []
    let currentChunk: string[] = []
    let currentSize = 0
    let statementBuffer: string[] = []
    let bufferSize = 0
    let inMultiLineStatement = false
    const encoder = new TextEncoder()

    for (let i = 0; i < bodyLines.length; i++) {
      const line = bodyLines[i]
      const lineBytes = encoder.encode(line).length
      const trimmed = line.trim()

      const openParens = (line.match(/\(/g) || []).length
      const closeParens = (line.match(/\)/g) || []).length
      const hasSemicolon = trimmed.endsWith(';')

      if (!inMultiLineStatement && openParens > closeParens) {
        inMultiLineStatement = true
      }

      statementBuffer.push(line)
      bufferSize += lineBytes

      if (inMultiLineStatement && openParens <= closeParens && hasSemicolon) {
        inMultiLineStatement = false
      }

      const canSplit = hasSemicolon && !inMultiLineStatement

      if (canSplit || i === bodyLines.length - 1) {
        if (currentChunk.length > 0 && currentSize + bufferSize > maxBytes) {
          chunks.push([...currentChunk])
          currentChunk = []
          currentSize = 0
        }

        currentChunk.push(...statementBuffer)
        currentSize += bufferSize
        statementBuffer = []
        bufferSize = 0
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk)
    }

    return chunks
  }

  wrapChunks(chunks: string[][], header: string, footer: string): string[] {
    if (chunks.length <= 1) {
      return chunks.map(chunk => this.assembleFile(header, chunk, footer))
    }

    return chunks.map((chunk, index) => {
      const chunkNum = index + 1
      const partHeader = `-- Part ${chunkNum} of ${chunks.length}\n`
      return this.assembleFile(header, chunk, footer, partHeader)
    })
  }

  private assembleFile(header: string, body: string[], footer: string, partHeader = ''): string {
    const parts: string[] = []

    if (header) {
      parts.push(header, '')
    }

    if (partHeader) {
      parts.push(partHeader)
    }

    parts.push(body.join('\n'))

    if (footer) {
      parts.push('', footer)
    }

    return parts.join('\n')
  }

  split(content: string, options: SplitOptions): string[] {
    const { mode, value } = options
    const parsed = this.parse(content)

    let chunks: string[][]

    if (mode === 'size') {
      chunks = this.splitBySize(parsed.body, value * 1024 * 1024)
    } else {
      chunks = this.splitByLines(parsed.body, value)
    }

    return this.wrapChunks(chunks, parsed.header, parsed.footer)
  }
}
