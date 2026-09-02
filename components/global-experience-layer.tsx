'use client'

import Link from 'next/link'
import { useState } from 'react'
import { GlobalPreferences } from '@/components/global-preferences'

const quickLinks = [
  ['SOS & Emergency', '/safety'],
  ['Navigation', '/safety-guides'],
  ['Weather', '/safety-guides'],
  ['Blood Mesh', '/safety'],
] as const

export function GlobalExperienceLayer() {
  const [rideActive, setRideActive] = useState(false)

  return <>
    <aside className="global-quick-access" aria-label="Global quick access">
      <span className="global-quick-label">BBBT / ACCESS</span>
      {quickLinks.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
      <button type="button" onClick={() => setRideActive((active) => !active)}>{rideActive ? 'Stop Ride' : 'Start Ride'}</button>
      <GlobalPreferences />
      <Link href="/assistant">Voice Assistant</Link>
    </aside>
    {rideActive && <div className="active-ride-context" role="status"><strong>Ride context active</strong><span>Prototype entry only — no GPS tracking, dispatch, or live SOS is connected.</span><button type="button" onClick={() => setRideActive(false)}>Stop Ride</button></div>}
  </>
}

export function LocalizedBrandName() { return <span>Brand Biker Brotherhood Trust</span> }
