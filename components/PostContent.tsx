import Link from 'next/link'
import { PostContentBlock } from '@/lib/posts'

interface PostContentProps {
  content: PostContentBlock[]
}

export function PostContent({ content }: PostContentProps) {
  return (
    <>
      {content.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            if (block.variant === 'lead') {
              return (
                <p key={index} className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {renderTextWithLinks(block.text || '')}
                </p>
              )
            }
            return (
              <p key={index} className="mb-4 leading-relaxed">
                {renderTextWithLinks(block.text || '')}
              </p>
            )

          case 'heading':
            const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements
            const headingClasses = {
              1: 'text-4xl font-bold mt-8 mb-4',
              2: 'text-2xl font-semibold mt-8 mb-4',
              3: 'text-xl font-semibold mt-6 mb-3',
              4: 'text-lg font-semibold mt-4 mb-2',
            }[block.level || 2]
            return (
              <HeadingTag key={index} className={headingClasses}>
                {block.text}
              </HeadingTag>
            )

          case 'list':
            const ListTag = block.style === 'ordered' ? 'ol' : 'ul'
            const listClasses = block.style === 'ordered' 
              ? 'list-decimal pl-6 mb-4 space-y-2' 
              : 'list-disc pl-6 mb-4 space-y-2'
            return (
              <ListTag key={index} className={listClasses}>
                {block.items?.map((item, itemIndex) => (
                  <li key={itemIndex} className="whitespace-pre-line">
                    {renderTextWithLinks(item)}
                  </li>
                ))}
              </ListTag>
            )

          case 'code':
            return (
              <pre key={index} className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-sm font-mono">{block.text}</code>
              </pre>
            )

          case 'table':
            return (
              <div key={index} className="overflow-x-auto mb-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      {block.headers?.map((header, headerIndex) => (
                        <th key={headerIndex} className="text-left p-2 font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows?.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex < (block.rows?.length || 0) - 1 ? 'border-b' : ''}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-2">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )

          case 'callout':
            const calloutClasses = {
              note: 'bg-muted p-4 rounded-lg mb-6',
              highlight: 'bg-primary/10 border border-primary p-6 rounded-lg mb-8',
              warning: 'bg-yellow-500/10 border border-yellow-500 p-4 rounded-lg mb-6',
            }[block.variant || 'note']
            return (
              <div key={index} className={calloutClasses}>
                <p className={block.variant === 'highlight' ? 'text-sm' : 'text-sm text-muted-foreground'}>
                  {renderTextWithLinks(block.text || '')}
                </p>
              </div>
            )

          case 'cta':
            return (
              <div key={index} className="bg-muted p-6 rounded-lg">
                <h3 className="font-semibold mb-2">{block.title}</h3>
                <p className="mb-4">{block.text}</p>
                <Link
                  href={block.buttonLink || '/'}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {block.buttonText}
                </Link>
              </div>
            )

          default:
            return null
        }
      })}
    </>
  )
}

// Helper function to render text with markdown-style links
function renderTextWithLinks(text: string): React.ReactNode {
  // Handle bold text **text**
  const parts = text.split(/(\*\*.*?\*\*)/g)
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}
