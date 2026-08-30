import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bbbt.in'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 }, { url: `${siteUrl}/safety-guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 }, { url: `${siteUrl}/#protocol`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 }, { url: `${siteUrl}/#ledger`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 }, { url: `${siteUrl}/#vault`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 }]
}
