import { InfoPage } from '@/components/public-pages'
export const metadata = {
  title: 'SOS & Emergency Support | BBBT',
  description: 'BBBT\u2019s proposed emergency-support flow and rider readiness framework. A simulation \u2014 not a live emergency service.',
  alternates: { canonical: '/emergency' },
  openGraph: { title: 'SOS & Emergency Support | BBBT', description: 'An intended rider-to-support response flow. This prototype does not provide live emergency response.', url: 'https://www.bbbt.in/emergency', type: 'website' },
}
export default function Page() { return <InfoPage kind="emergency" /> }
