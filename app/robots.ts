import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bbbt.in'

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/dashboard/', '/rider-login', '/rider-signup', '/auth/', '/api/'] }], sitemap: `${siteUrl}/sitemap.xml` }
}
