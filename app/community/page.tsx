import { InfoPage } from '@/components/public-pages'
export const metadata = {
  title: 'Rider Community | BBBT',
  description: 'BBBT adds structure around India\u2019s riding communities \u2014 connecting riders, groups, marshals and the Council through safety and knowledge.',
  alternates: { canonical: '/community' },
  openGraph: { title: 'Rider Community | BBBT', description: 'A participation layer for riders and groups. Community, safety and intelligence.', url: 'https://www.bbbt.in/community', type: 'website' },
}
export default function Page() { return <InfoPage kind="community" /> }
