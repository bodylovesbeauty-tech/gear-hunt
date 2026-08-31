import { InfoPage } from '@/components/public-pages'
export const metadata = {
  title: 'Rider Safety Infrastructure | BBBT',
  description: 'A proposed rider safety system organised around the ride: before, during, when something goes wrong, and after.',
  alternates: { canonical: '/safety' },
  openGraph: { title: 'Rider Safety Infrastructure | BBBT', description: 'Scenario-led safety modules for Indian riding communities. Prototype, not live coverage.', url: 'https://www.bbbt.in/safety', type: 'website' },
}
export default function Page() { return <InfoPage kind="safety" /> }
