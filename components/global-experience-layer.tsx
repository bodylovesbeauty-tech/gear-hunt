'use client'

import Link from 'next/link'

const quickLinks = [
  ['SOS & Emergency', '/sos'],
  ['Navigation', '/corridor'],
  ['Weather', '/weather'],
  ['Blood Mesh', '/blood-mesh'],
] as const

export function GlobalExperienceLayer() {
  return <>
    <aside className="global-quick-access" aria-label="Global quick access">
      <span className="global-quick-label">BBBT / ACCESS</span>
      {quickLinks.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
      <Link href="/start-ride">Start Ride</Link>
      <Link href="/assistant">Voice Assistant</Link>
    </aside>

  </>
}

export function LocalizedBrandName() { return <span>Brand Biker Brotherhood Trust</span> }
