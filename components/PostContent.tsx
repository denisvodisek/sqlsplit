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
                <p key={index} className="text-lg text-muted-foreground mb-6">
                  {renderText(block.text || '')}
                </p>
              )
            }
            return (
              <p key={index}>
                {renderText(block.text || '')}
              </p>
            )

          case 'heading':
            const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements
            return (
              <HeadingTag key={index}>
                {block.text}
              </HeadingTag>
            )

          case 'list':
            const ListTag = block.style === 'ordered' ? 'ol' : 'ul'
            return (
              <ListTag key={index}>
                {block.items?.map((item, i) => (
                  <li key={i}>{renderText(item)}</li>
                ))}
              </ListTag>
            )

          case 'code':
            return (
              <pre key={index}>
                <code>{block.text}</code>
              </pre>
            )

          case 'callout':
            return (
              <blockquote key={index}>
                {renderText(block.text || '')}
              </blockquote>
            )

          case 'cta':
            return (
              <div key={index} className="not-prose rounded-xl p-5 my-6 bg-white/80 border border-black/5">
                <p className="font-medium mb-1 text-foreground">{block.title}</p>
                <p className="text-sm text-muted-foreground mb-4">{block.text}</p>
                <Link
                  href={block.buttonLink || '/'}
                  className="inline-block text-sm font-medium bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors"
                >
                  <span className="text-white">{block.buttonText}</span>
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

function renderText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}
