import { ContactPage } from '@/components/public-pages'
export const metadata = {
  title: 'Contact BBBT',
  description: 'Contact BBBT about rider safety, communities, partnerships, the Founding Rider Council and the future ecosystem.',
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact BBBT', description: 'Choose the right pathway to start a conversation with BBBT.', url: 'https://www.bbbt.in/contact', type: 'website' },
}
export default function Page() { return <ContactPage /> }
