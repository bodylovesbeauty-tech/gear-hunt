import type { Metadata } from 'next'
import InvestorDeck from '@/components/investor-deck'

export const metadata: Metadata = {
  title: 'Investor Intelligence Room | BBBT',
  description: 'An honest interactive presentation of BBBT rider safety infrastructure, prototype evidence and the path ahead.',
}

export default function InvestorPage() {
  return <InvestorDeck />
}
