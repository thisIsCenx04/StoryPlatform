import type { SeoBreadcrumbList } from '../../types/seo'

const BreadcrumbJsonLd = ({ breadcrumb }: { breadcrumb: SeoBreadcrumbList }) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.itemUrl,
    })),
  }
  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}

export default BreadcrumbJsonLd
