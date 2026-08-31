import { InfoPage } from '@/components/public-pages'
export const metadata = {
  title: 'About BBBT Trust',
  description: 'Why BBBT Trust exists: a non-profit safety, community, governance and rider-welfare layer for India\u2019s riding communities.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'About BBBT Trust', description: 'The rider reality, and the safety and welfare layer BBBT is designed to add.', url: 'https://www.bbbt.in/about', type: 'website' },
}
export default function Page() { return <InfoPage kind="about" /> }
