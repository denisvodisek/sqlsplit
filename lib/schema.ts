import type { Metadata } from 'next'

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

interface WebApplicationSchemaProps {
  name: string
  description: string
  applicationCategory: string
  operatingSystem: string
  offers?: {
    price: string
    priceCurrency: string
  }
}

export function generateWebApplicationSchema({
  name = 'SQLSplit',
  description = 'Free online tool to split large SQL files into manageable chunks',
  applicationCategory = 'DeveloperApplication',
  operatingSystem = 'Web Browser',
  offers = { price: '0', priceCurrency: 'USD' },
}: Partial<WebApplicationSchemaProps> = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: name,
    description: description,
    url: 'https://sqlsplit.com',
    applicationCategory: applicationCategory,
    operatingSystem: operatingSystem,
    offers: {
      '@type': 'Offer',
      ...offers,
    },
    featureList: [
      'Split SQL files by line count or file size',
      'Support for .sql and .gz files',
      '100% private - no file uploads',
      'Intelligent splitting logic',
      'Download all chunks as ZIP',
    ],
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '2.0',
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
    sameAs: [
      'https://github.com/denisvodisek/sqlsplit',
    ],
  }
}
