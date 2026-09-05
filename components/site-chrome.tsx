'use client'

import { usePathname } from 'next/navigation'
import { Header, Footer } from '@/components/public-site'

const appOnlyPrefixes = ['/dashboard', '/rider-dashboard', '/group-admin-dashboard', '/marshal-dashboard', '/founding-rider-council-dashboard', '/admin', '/login', '/signup', '/auth', '/safety-guides', '/assistant']

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const appOnly = appOnlyPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  if (appOnly) return <>{children}</>
  return <><Header />{children}<Footer /></>
}
