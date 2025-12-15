import type { SeoOrganization } from '../../types/seo'

const OrganizationJsonLd = ({ organization }: { organization: SeoOrganization }) => {
  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organization.name,
    url: organization.url,
  }
  if (organization.legalName) data.legalName = organization.legalName
  if (organization.logoUrl) data.logo = organization.logoUrl
  if (organization.contactEmail) data.email = organization.contactEmail
  if (organization.phone) data.telephone = organization.phone
  data.address = {
    '@type': 'PostalAddress',
    streetAddress: organization.streetAddress,
    addressLocality: organization.addressLocality,
    addressRegion: organization.addressRegion,
    postalCode: organization.postalCode,
    addressCountry: organization.addressCountry,
  }
  if (organization.sameAsJson) {
    try {
      data.sameAs = JSON.parse(organization.sameAsJson)
    } catch {
      // ignore parse error
    }
  }
  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}

export default OrganizationJsonLd
