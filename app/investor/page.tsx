'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ResponsibilityNotice } from '@/components/role-entry'

export default function InvestorPage() { const [submitted, setSubmitted] = useState(false); return <main className="page-shell investor-page"><div className="section-label">Private pathway</div><h1>Mission-aligned capital, responsibly considered.</h1><p className="page-lede">Request access to BBBT’s investor intelligence room. We review fit before sharing sensitive model details.</p>{submitted ? <div className="information-card"><h2>Request received</h2><p>Thank you. This prototype records your intent locally for review; no investment commitment has been made.</p><Link className="btn btn-red" href="/#join">Return to BBBT</Link></div> : <form className="information-card investor-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}><label>Full name<input required name="name" /></label><label>Work email<input required type="email" name="email" /></label><label>Why are you exploring BBBT?<textarea required name="reason" rows={4} /></label><label className="check-row"><input required type="checkbox" /> I understand this is an expression of interest, not an offer or financial advice.</label><button className="btn btn-red" type="submit">Request access</button></form>}<ResponsibilityNotice /></main> }
