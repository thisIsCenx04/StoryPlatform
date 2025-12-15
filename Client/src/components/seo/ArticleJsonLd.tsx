import type { SeoArticle } from '../../types/seo'

const ArticleJsonLd = ({ article }: { article: SeoArticle }) => {
  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.canonicalUrl,
    },
    headline: article.headline,
    description: article.metaDescription,
    image: article.imageUrl,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: article.publisherName
      ? {
          '@type': 'Organization',
          name: article.publisherName,
          logo: article.publisherLogo ? { '@type': 'ImageObject', url: article.publisherLogo } : undefined,
        }
      : undefined,
    articleSection: article.articleSection,
    keywords: article.metaKeywords,
  }
  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}

export default ArticleJsonLd
