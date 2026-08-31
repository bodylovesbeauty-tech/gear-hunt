import type { Metadata } from 'next'
import './crystal.css'

export const metadata: Metadata = {
  title: 'Black Crystal Design System',
  description: 'Internal BBBT Black Crystal UI component lab. Not a public page.',
  robots: { index: false, follow: false },
}

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return <div className="bcx">{children}</div>
}
