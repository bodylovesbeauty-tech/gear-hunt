'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { usePreferences } from '@/components/preference-provider'
import { GlobalPreferences } from '@/components/global-preferences'
import { currencies, formatMoney, type CurrencyCode } from '@/lib/global-preferences'

const quickLinks = [
  ['SOS & Emergency', '/safety'],
  ['Navigation', '/safety-guides'],
  ['Weather', '/safety-guides'],
  ['Blood Mesh', '/safety'],
] as const

export function GlobalExperienceLayer() {
  const { preferences } = usePreferences()
  const [calculatorOpen, setCalculatorOpen] = useState(false)
  const [amount, setAmount] = useState('1599')
  const [from, setFrom] = useState<CurrencyCode>('INR')
  const [to, setTo] = useState<CurrencyCode>(preferences.currency)
  const [rideActive, setRideActive] = useState(false)
  const result = useMemo(() => formatMoney(Number(amount) || 0, to, from), [amount, from, to])

  return <>
    <aside className="global-quick-access" aria-label="Global quick access">
      <span className="global-quick-label">BBBT / ACCESS</span>
      {quickLinks.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
      <button type="button" onClick={() => setRideActive((active) => !active)}>{rideActive ? 'Stop Ride' : 'Start Ride'}</button>
      <button type="button" onClick={() => setCalculatorOpen((open) => !open)} aria-expanded={calculatorOpen}>Currency Converter</button>
      <GlobalPreferences />
      <Link href="/assistant">Voice Assistant</Link>
    </aside>
    {rideActive && <div className="active-ride-context" role="status"><strong>Ride context active</strong><span>Prototype entry only — no GPS tracking, dispatch, or live SOS is connected.</span><button type="button" onClick={() => setRideActive(false)}>Stop Ride</button></div>}
    {calculatorOpen && <section className="currency-calculator" aria-label="Currency Converter"><div><strong>Currency Converter</strong><button type="button" onClick={() => setCalculatorOpen(false)} aria-label="Close currency calculator">×</button></div><p>Reference-rate display only. Source values remain unchanged.</p><label>Amount<input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} /></label><div className="currency-row"><label>From<select value={from} onChange={(event) => setFrom(event.target.value as CurrencyCode)}>{Object.keys(currencies).map((code) => <option key={code}>{code}</option>)}</select></label><button type="button" onClick={() => { const next = from; setFrom(to); setTo(next) }}>Swap</button><label>To<select value={to} onChange={(event) => setTo(event.target.value as CurrencyCode)}>{Object.keys(currencies).map((code) => <option key={code}>{code}</option>)}</select></label></div><output>{result}</output><small>Rates are illustrative prototype references, not a quote or payment amount.</small></section>}
  </>
}

export function LocalizedBrandName() { return <span>Brand Biker Brotherhood Trust</span> }
