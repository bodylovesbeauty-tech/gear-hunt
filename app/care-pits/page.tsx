import { InfoPage } from '@/components/public-pages'
export const metadata = {
  title: 'Care Pit Network | BBBT',
  description: 'The proposed BBBT Care Pit rider-support network built around dhabas, caf\u00e9s, service points, fuel stops and medical help.',
  alternates: { canonical: '/care-pits' },
  openGraph: { title: 'Care Pit Network | BBBT', description: 'A conceptual highway support network. Locations are demo or prototype states, not verified sites.', url: 'https://www.bbbt.in/care-pits', type: 'website' },
}
export default function Page() { return <InfoPage kind="care-pits" /> }
