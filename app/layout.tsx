import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bbbt.in'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  title: 'BBBT | India\'s Critical Highway Rider Safety & SOS Emergency Infrastructure',
  description: 'Join the ultimate biker trust for instant highway SOS tracking, verified Blood Mesh coordination, and automated trauma center routing. Register for the core pre-launch safety network today.',
  keywords: ['biker safety app india', 'highway sos network', 'motorcycle emergency response', 'rider blood donor mesh', 'bullet club safety infrastructure'],
  openGraph: { title: 'BBBT | Critical Rider Safety Infrastructure', description: 'The trust protocol for India\'s riders. Instant highway SOS tracking, verified blood mesh coordination, and trauma center routing.', type: 'website', siteName: 'BBBT', locale: 'en_IN', url: siteUrl, images: ['/og-image.png'] },
  twitter: { card: 'summary_large_image', title: 'BBBT | Critical Rider Safety Infrastructure', description: 'The trust protocol for India\'s riders.', images: ['/og-image.png'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  generator: 'BBBT',
}

export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#000000', userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-black"><body className="antialiased">{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'BBBT', alternateName: 'Brand Biker Brotherhood Trust', url: siteUrl, description: 'Rider safety and highway emergency infrastructure for India.', areaServed: { '@type': 'Country', name: 'India' }, knowsAbout: ['rider safety', 'highway SOS', 'blood donor coordination', 'motorcycle safety'], sameAs: ['https://instagram.com/bbbt', 'https://facebook.com/bbbt', 'https://youtube.com/@bbbt'] }) }} />{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
