'use client'

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { usePreferences } from '@/components/preference-provider'
import { t } from '@/lib/translations'
import './bbbt-v2-crystal.css'

const gateways = [
  ['RIDER', 'Your safety identity', 'Build readiness around the ride.', '/signup'],
  ['GROUP ADMIN', 'Your community', 'Give your group a safer rhythm.', '/signup?role=Group%20Admin'],
  ['GROUP MARSHAL', 'Your responsibility', 'Support the people riding with you.', '/signup?role=Group%20Marshal'],
  ['INDEPENDENT MARSHAL', 'Your responsibility', 'Support riders beyond one group.', '/signup?role=Independent%20Marshal'],
  ['FOUNDING RIDER COUNCIL MEMBER', 'Your experience', 'Help test what riders need next.', '/signup?role=Founding%20Rider%20Council%20Member'],
  ['INVESTOR', 'The opportunity', 'See the ecosystem behind the work.', '/signup?role=Investor'],
  ['PARTNER', 'The opportunity', 'Help shape the support ecosystem.', '/contact'],
]
const protocol = [
  ['01', 'SOS / Emergency Queues', 'Organise urgent signals into a clearer response concept.'],
  ['02', 'Blood & Hospital Mesh', 'A future coordination layer for verified care partners.'],
  ['03', 'Safety, Training & Kit', 'Turn preparation into repeatable rider readiness.'],
  ['04', 'Navigation & Corridor Scan', 'Surface route context before and during a journey.'],
  ['05', 'Democratic Governance & Trust Matrix', 'Keep trust, accountability, and rider voice visible.'],
  ['06', 'Regional Marshal Network', 'Give experienced riders a structured support role.'],
  ['07', 'Care Pit Commerce', 'Connect route-side care with a future commercial layer.'],
  ['08', 'Training & Certification', 'Make learning visible without pretending the engine is live.'],
  ['09', 'Infrastructure Audits', 'Make readiness, partners, and operating assumptions reviewable.'],
  ['10', 'The Trust Protocol', 'Connect the ten accountable layers into one safety architecture.'],
]
const faqs = [
  ['What is BBBT?', 'BBBT is a prototype of rider safety and community infrastructure for India. It is being designed in phases.'],
  ['Is BBBT a social network?', 'No. BBBT is designed to add structured safety, readiness, governance, and support around communities that already exist.'],
  ['Are emergency features live?', 'No. SOS, dispatch, blood mesh, live Care Pit availability, and emergency coordination are future concepts.'],
  ['Who can join BBBT?', 'Riders, Group Admins, Group Marshals, Independent Marshals, Founding Rider Council Members, Partners, and Investors can choose the pathway that fits their role.'],
  ['How will BBBT decide its membership price?', 'BBBT is currently learning how much riders are comfortable spending on their safety each year. This is a self-declared safety-spending preference and is not a purchase commitment or an actual spending record. BBBT will use aggregated rider insights together with operational and safety requirements to help determine an appropriate future annual membership price.'],
]

export function BbbtV2Home() {
  const { preferences } = usePreferences()
  const [openProtocol, setOpenProtocol] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  return (
    <main className="v2-home">
      <style>{`@media (max-width: 800px){.v2-nav{padding:1rem 1.25rem}.v2-nav nav{display:none}.v2-nav-actions{display:flex;gap:.5rem}.v2-nav-actions .v2-nav-login{display:inline-flex!important;padding:.65rem .75rem;border:1px solid #54605d;color:#f2f4f1!important;font-size:.68rem;font-weight:700;text-decoration:none}.v2-nav-actions .v2-button{padding:.65rem .75rem;font-size:.68rem}.v2-ecosystem-head{display:block}.v2-ecosystem-head h2{max-width:100%;font-size:clamp(3.2rem,15vw,5.5rem);line-height:.9;overflow-wrap:normal;word-break:normal}.v2-ecosystem-head .v2-intro-copy{max-width:34rem;margin-top:2rem}.v2-ecosystem .v2-worlds{display:flex;flex-direction:column}.v2-ecosystem .v2-bridge{order:2}.v2-ecosystem .v2-holding{order:3}}`}</style>
      <section className="v2-hero"><div className="v2-hero-copy"><p className="v2-kicker">THE ROAD CONNECTS US. SAFETY SHOULD TOO.</p><h1>{preferences.language==='en'?<>India&apos;s rider<br /><em>safety infrastructure.</em></>:<>{t('nav.safety',preferences.language)}<br /><em>{t('nav.community',preferences.language)}</em></>}</h1><p className="v2-lede">BBBT is designing a connected safety, emergency-readiness, community, welfare, training, and highway-support ecosystem for riders across India.</p><div className="v2-actions"><Link className="v2-button v2-button-red" href="/signup">Join BBBT <span>↗</span></Link><Link className="v2-text-link" href="#ecosystem">Explore the ecosystem <span>↓</span></Link></div><p className="v2-status"><span /> PROTOTYPE <i>•</i> PRE-LAUNCH</p></div><div className="v2-hero-art"><Image src="/images/home-group-ride.png" alt="Diverse adult riders traveling together on an open highway." fill priority sizes="(max-width: 800px) 100vw, 52vw"/><div className="v2-scanline" /><div className="v2-art-label">ROAD SYSTEM / INDIA</div><div className="v2-art-stamp">READY<br /><strong>WHEN THE ROAD ISN&apos;T</strong></div></div></section>

      <section className="v2-human"><p>THE ROAD CONNECTS US.</p><h2>SAFETY <em>SHOULD TOO.</em></h2><span>One layer between the rider, the ride, and the people who can help.</span></section>

      <section id="ecosystem" className="v2-problem v2-section"><div className="v2-problem-image"><span className="v2-art-label">A GOOD RIDE CAN CHANGE IN SECONDS</span></div><div><p className="v2-kicker">THE PROBLEM</p><h2>Far from home.<br /><span>Still not alone.</span></h2><p className="v2-intro-copy">A puncture. A roadside stop. A dark stretch of highway. Riders already improvise support; BBBT is being designed to make that support more visible, prepared, and accountable.</p></div></section>

      <section className="v2-system v2-section"><div className="v2-section-head"><div><p className="v2-kicker">THE BBBT RESPONSE</p><h2>From rider<br /><span>to support.</span></h2></div><p className="v2-intro-copy">A connected concept for the moments that matter.</p></div><div className="v2-system-line">{['RIDER','SAFETY IDENTITY','ALERT','VERIFIED NETWORK','SUPPORT'].map((item, i) => <div className="v2-system-node" key={item}><span>{i + 1}</span><strong>{item}</strong>{i < 4 ? <i>→</i> : <i className="v2-node-end" aria-hidden="true">●</i>}</div>)}</div></section>

      <section className="v2-pillars v2-section"><div className="v2-section-head"><div><p className="v2-kicker">NOT ANOTHER RIDER COMMUNITY</p><h2>BBBT adds<br /><span>structure.</span></h2></div><p className="v2-intro-copy">Communities already have connection, experience, organisation, and peer support. BBBT adds safety identity, emergency readiness, training, highway support, governance, and rider intelligence.</p></div><div className="v2-pillar-grid"><article className="v2-pillar"><b>ALREADY THERE</b><h3>Community instinct</h3><p>Connection, lived experience, ride organisation, and peer support.</p></article><article className="v2-pillar"><b>BBBT LAYER</b><h3>Structured support</h3><p>Readiness, safety identity, training, Care Pit concepts, governance, and welfare.</p></article><article className="v2-pillar"><b>THE INTENT</b><h3>Safer rhythm</h3><p>Respect the clubs and groups riders already trust. Add useful infrastructure around them.</p></article></div></section>

      <section className="v2-gateways v2-section"><p className="v2-kicker">WHERE DO YOU BELONG?</p><h2>Built with<br /><span>real riders.</span></h2><div className="v2-audience-grid">{gateways.map(([label, title, copy, href]) => <Link className="v2-audience-card" href={href} key={label}><span>↗</span><small>{label}</small><h3>{title}</h3><p>{copy}</p><strong>Enter the experience</strong></Link>)}</div></section>

      <section className="v2-identity v2-section"><div><p className="v2-kicker">RIDER SAFETY IDENTITY</p><h2>Your ride.<br /><span>Known.</span></h2><p className="v2-intro-copy">A visual preview of the future rider identity: profile, bike, readiness, emergency contacts, training, Safety Kit, and network.</p><span className="v2-status"><span /> PROTOTYPE / VISUAL PREVIEW ONLY</span></div><div className="v2-identity-panel"><div className="v2-profile-top"><span>BBBT RIDER IDENTITY</span><b>PROTOTYPE</b></div><div className="v2-profile-avatar">R</div><h3>Rider readiness</h3><div className="v2-profile-grid">{['Profile','Bike','Safety readiness','Emergency contacts','Training','Safety Kit','Network'].map((x) => <div key={x}><span>✓</span>{x}</div>)}</div></div></section>

      <section className="v2-route"><div className="v2-route-image" aria-hidden="true" /><div className="v2-route-copy"><p className="v2-kicker">CARE PIT / DEMONSTRATION CONCEPT</p><h2>Support<br /><span>on the route.</span></h2><p>A future route-side network connecting a rider to a Care Pit, service, rest, fuel, medical, and healthcare partners. This is a concept, not nationwide live coverage.</p><div className="v2-care-list"><span>DHABA</span><span>HOTEL / RESORT</span><span>SERVICE / PIT</span><span>HEALTHCARE PARTNER</span></div><Link className="v2-button v2-button-outline" href="/care-pits">Explore Care Pit</Link></div></section>

      <section className="v2-protocol v2-section"><div className="v2-section-head"><div><p className="v2-kicker">THE ARCHITECTURE OF TRUST</p><h2>Trust<br /><span>Protocol.</span></h2></div><p className="v2-intro-copy">A system map, not a feature list. Select a node to understand what it is intended to do.</p></div><div className="v2-protocol-layout"><div className="v2-core">BBBT<br /><strong>TRUST CORE</strong><small>PROTOTYPE ARCHITECTURE</small></div><div className="v2-protocol-nodes">{protocol.map(([num, title, copy]) => <button className={openProtocol === Number(num) - 1 ? 'active' : ''} key={num} onClick={() => setOpenProtocol(Number(num) - 1)}><span>{num}</span><strong>{title}</strong><small>{openProtocol === Number(num) - 1 ? 'ACTIVE' : 'CONCEPT'}</small></button>)}</div></div><div className="v2-protocol-detail" aria-live="polite"><small>LAYER {protocol[openProtocol][0]}</small><b>{protocol[openProtocol][1]}</b><p><strong>WHAT IT DOES</strong> {protocol[openProtocol][2]}</p><p><strong>WHY IT MATTERS</strong> Keeps the safety concept accountable, reviewable, and grounded in rider needs.</p><small>STATUS: PROTOTYPE / VERIFIED SOURCE REQUIRED</small></div></section>

      <section className="v2-council v2-section"><p className="v2-kicker">FOUNDING RIDER COUNCIL</p><h2>Built with riders.<br /><span>Tested by riders.</span></h2><p className="v2-lede">Experienced riders contribute intelligence, test prototypes, and help make the system responsible. Council members are not Co-Founders and do not receive automatic ownership.</p><div className="v2-loop">{['RIDER PROBLEM','COUNCIL INTELLIGENCE','RESEARCH','PROTOTYPE','FIELD TEST','FEEDBACK','BETTER PRODUCT'].map((x) => <span key={x}>{x}</span>)}</div><Link className="v2-button v2-button-red" href="/signup?role=Founding%20Rider%20Council%20Member">Meet the Council</Link></section>

      <section className="v2-ecosystem v2-section"><div className="v2-ecosystem-head"><div><p className="v2-kicker">ONE ECOSYSTEM / TWO PURPOSES</p><h2>Connected by need.<br /><span>Separated by purpose.</span></h2></div><p className="v2-intro-copy">Rider intelligence can inform research and product development without collapsing safety responsibility into commercial operations.</p></div><div className="v2-worlds"><article className="v2-world v2-trust"><div className="v2-world-mark">TRUST / 01</div><p className="v2-kicker">BBBT TRUST</p><h3>People first.</h3><p>Safety, welfare, learning, community accountability, governance, and rider support.</p><div className="v2-world-signals"><span>SAFETY</span><span>COMMUNITY</span><span>GOVERNANCE</span><span>WELFARE</span></div><Link href="/safety">Explore the Trust ↗</Link></article><div className="v2-bridge" aria-label="BBBT ecosystem bridge"><span>RIDER NEED</span><i>→</i><span>RIDER INTELLIGENCE</span><i>→</i><span>RESEARCH</span><i>→</i><span>PRODUCT</span></div><article className="v2-world v2-holding"><div className="v2-world-mark">HOLDING / 02</div><p className="v2-kicker">BBBT HOLDING</p><h3>Ideas into infrastructure.</h3><p>Products, technology, research, partnerships, commercial operations, and the future BBBT Shop.</p><div className="v2-world-signals"><span>PRODUCTS</span><span>TECHNOLOGY</span><span>RESEARCH</span><span>SHOP</span></div><Link href="/contact">Partner with BBBT ↗</Link></article></div></section>

      <section className="v2-investor v2-section"><p className="v2-kicker">AN ECOSYSTEM WORTH WATCHING</p><h2>People.<br />Infrastructure.<br /><span>Future value.</span></h2><div className="v2-investor-grid"><div><b>PEOPLE</b><p>Riders · Communities · Council</p></div><div><b>INFRASTRUCTURE</b><p>Safety · Training · Care Pit · Emergency concept</p></div><div><b>FUTURE VALUE</b><p>Technology · Products · BBBT Shop · Commercial layer</p></div></div><Link className="v2-button v2-button-red" href="/investor">Investor brief ↗</Link></section>

      <section className="v2-faq v2-section"><div><p className="v2-kicker">QUESTIONS WORTH ANSWERING</p><h2>Start with<br /><span>clarity.</span></h2></div><div>{faqs.map(([q, answer], i) => <div className="v2-faq-item" key={q}><button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}><span>0{i + 1}</span>{q}<b>{openFaq === i ? '−' : '+'}</b></button>{openFaq === i && <p>{answer}</p>}</div>)}</div></section>

      <section className="v2-final"><p className="v2-kicker">FOR EVERY RIDER WHO BELIEVES THE ROAD CAN BE BETTER</p><h2>Ready when<br /><span>the road isn&apos;t.</span></h2><div className="v2-actions"><Link className="v2-button v2-button-red" href="/signup">Join BBBT ↗</Link>{gateways.map(([label,, ,href]) => <Link className="v2-text-link" href={href} key={`final-${label}`}>{label === 'RIDER' ? 'As a Rider' : label.split(' ').map((word) => word[0] + word.slice(1).toLowerCase()).join(' ')}</Link>)}</div></section>

    </main>
  )
}
