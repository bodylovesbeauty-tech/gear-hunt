'use client'

import { ArrowRight, MapPinned, ShieldCheck, TrendingUp } from 'lucide-react'

export default function InvestorProof() {
  return <section className="investor-proof" aria-labelledby="proof-title">
    <div className="section-heading"><div><span className="eyebrow">OPERATING THESIS / TRANSPARENT BY DESIGN</span><h2 id="proof-title">A safer road needs<br /><span>shared infrastructure.</span></h2></div><p>BBBT is building a trusted operating layer for India&apos;s riders. The product is in prototype mode: live counters are sourced from Supabase, while response operations remain clearly marked as simulation until a local pilot is active.</p></div>
    <div className="proof-grid"><article><span className="proof-icon"><ShieldCheck size={18} /></span><b>What is live today</b><p>Rider registration, authenticated profiles, emergency contacts, bikes, visitor analytics and expiring rider presence.</p><a href="/rider-signup">Create a rider profile <ArrowRight size={15} /></a></article><article><span className="proof-icon"><MapPinned size={18} /></span><b>Launch geography</b><p>South India pilot thesis: Bengaluru–Mysuru first, then high-volume corridors with rider group partners and care nodes.</p><a href="#protocol">See the protocol <ArrowRight size={15} /></a></article><article><span className="proof-icon"><TrendingUp size={18} /></span><b>Business model</b><p>Free safety identity at the base layer, with optional annual rider plans, group admin tools and verified care-pit partnerships.</p><a href="/safety-guides">Read safety guides <ArrowRight size={15} /></a></article></div>
    <div className="prototype-disclaimer" role="note"><strong>PROTOTYPE BOUNDARY</strong><span>Any SOS responder, hospital, map or verification claim labelled DEMO is illustrative and not a promise of emergency service availability.</span></div>
  </section>
}

export function FaqSchema() { return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'Is BBBT an emergency service today?', acceptedAnswer: { '@type': 'Answer', text: 'BBBT is currently a prototype. Its SOS and response screens demonstrate the intended workflow and are not a substitute for local emergency services.' } }, { '@type': 'Question', name: 'What does a rider profile store?', acceptedAnswer: { '@type': 'Answer', text: 'A rider profile can store emergency contacts, bike details, language preference and safety readiness information.' } }] }) }} /> }
