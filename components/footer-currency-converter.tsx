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
    <button className="footer-currency-trigger" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="footer-currency-calculator"><span className="footer-currency-dot" aria-hidden="true"/>Currency Converter</button>
    {open && <span id="footer-currency-calculator" className="currency-calculator footer-currency-calculator" role="dialog" aria-label="Currency Converter">
      <span className="currency-calculator-heading"><span><small>UTILITY / REFERENCE</small><strong>Currency Converter</strong></span><button className="currency-close" type="button" onClick={() => setOpen(false)} aria-label="Close currency calculator">×</button></span>
      <span className="currency-calculator-note">Illustrative reference rates. Source values remain unchanged.</span>
      <label className="currency-amount">Amount<input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
      <span className="currency-row"><label>From<select value={from} onChange={(event) => setFrom(event.target.value as CurrencyCode)}>{Object.keys(currencies).map((code) => <option key={code}>{code}</option>)}</select></label><button className="currency-swap" type="button" onClick={() => { setFrom(to); setCurrency(from) }} aria-label="Swap currencies">⇄</button><label>To<select value={to} onChange={(event) => setCurrency(event.target.value as CurrencyCode)}>{Object.keys(currencies).map((code) => <option key={code}>{code}</option>)}</select></label></span>
      <span className="currency-result-label">CONVERTED REFERENCE</span><output>{result}</output>
      <small>Not a quote, payment amount, or financial advice.</small>
    </span>}
  </span>
}
