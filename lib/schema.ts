interface ArticleSchemaProps {
  title: string
  description: string
  slug: string
  datePublished: string
  dateModified?: string
  author: string
  image?: string
}

export function generateArticleSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  author,
  image = 'https://sqlsplit.com/og-image.png',
}: ArticleSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
      url: 'https://sqlsplit.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SQLSplit',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sqlsplit.com/favicon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sqlsplit.com/blog/${slug}`,
    },
  }
}

export function generateWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SQLSplit',
    description: 'Split large SQL database dumps into smaller files for import. Fixes phpMyAdmin timeouts and MySQL max_allowed_packet errors.',
    url: 'https://sqlsplit.com',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Split SQL files by line count',
      'Split SQL files by file size',
      'Support for .sql and .gz compressed files',
      'Preserves SQL headers and footers',
      'Keeps multi-line statements intact',
      'Download individual files or ZIP archive',
      'Runs entirely in browser - no upload',
    ],
    browserRequirements: 'Requires JavaScript',
  }
}

interface BreadcrumbSchemaProps {
  items: { name: string; url: string }[]
}

export function generateBreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

interface FAQSchemaProps {
  questions: { question: string; answer: string }[]
}

export function generateFAQSchema({ questions }: FAQSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SQLSplit',
    url: 'https://sqlsplit.com',
    logo: 'https://sqlsplit.com/favicon.png',
    description: 'Free tool for splitting large SQL files',
    sameAs: [
      'https://github.com/denisvodisek/sqlsplit',
    ],
  }
}

export function generateHowToSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Split a Large SQL File',
    description: 'Split a large SQL database dump into smaller files that can be imported through phpMyAdmin or other tools with size limits.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Upload your SQL file',
        text: 'Drag and drop your .sql or .sql.gz file onto the upload area. The file is processed in your browser and never uploaded to any server.',
      },
      {
        '@type': 'HowToStep',
        name: 'Choose split method',
        text: 'Select whether to split by line count (e.g., 10,000 lines per file) or by file size (e.g., 10MB per file).',
      },
      {
        '@type': 'HowToStep',
        name: 'Download split files',
        text: 'Download individual SQL files or get all files as a ZIP archive. Import each file in order to your database.',
      },
    ],
  }
}
