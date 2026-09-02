'use client'

import { useMemo, useState } from 'react'
import { currencies, formatMoney, type CurrencyCode } from '@/lib/global-preferences'
import { usePreferences } from '@/components/preference-provider'

export function FooterCurrencyConverter() {
  const { preferences, setCurrency } = usePreferences()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('1599')
  const [from, setFrom] = useState<CurrencyCode>('INR')
  const to = preferences.currency
  const result = useMemo(() => formatMoney(Number(amount) || 0, to, from), [amount, from, to])

  return <span className="footer-currency">
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="footer-currency-calculator">Currency Converter</button>
    {open && <span id="footer-currency-calculator" className="currency-calculator footer-currency-calculator" role="dialog" aria-label="Currency Converter">
      <span className="currency-calculator-heading"><strong>Currency Converter</strong><button type="button" onClick={() => setOpen(false)} aria-label="Close currency calculator">×</button></span>
      <span className="currency-calculator-note">Reference-rate display only. Source values remain unchanged.</span>
      <label>Amount<input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
      <span className="currency-row"><label>From<select value={from} onChange={(event) => setFrom(event.target.value as CurrencyCode)}>{Object.keys(currencies).map((code) => <option key={code}>{code}</option>)}</select></label><button type="button" onClick={() => { setFrom(to); setCurrency(from) }}>Swap</button><label>To<select value={to} onChange={(event) => setCurrency(event.target.value as CurrencyCode)}>{Object.keys(currencies).map((code) => <option key={code}>{code}</option>)}</select></label></span>
      <output>{result}</output>
      <small>Rates are illustrative prototype references, not a quote or payment amount.</small>
    </span>}
  </span>
}
