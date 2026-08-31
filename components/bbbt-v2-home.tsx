'use client'

import Link from 'next/link'
import { useState } from 'react'

const pillars = [
  ['01', 'Safety identity', 'One rider profile for readiness, bikes, contacts, and trusted support.'],
  ['02', 'Community layer', 'Groups and Marshals make safer riding easier to organise and sustain.'],
  ['03', 'Care Pit network', 'A growing route-side support layer for breaks, repairs, and local care.'],
]

const audiences = [
  ['Riders', 'Build your safety identity and find your next ride-ready action.', '/signup'],
  ['Communities', 'Bring your group into a clearer, safer operating rhythm.', '/community'],
  ['Founding Rider Council', 'Contribute lived experience to the infrastructure riders deserve.', '/founding-rider-council'],
  ['Partners & investors', 'See the Trust and Holding model behind the opportunity.', '/partners'],
]

export function BbbtV2Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  return (
    <main className="v2-home">
      <header className="v2-nav">
        <Link className="v2-brand" href="/" aria-label="BBBT home"><span>BBBT</span><small>RIDER INFRASTRUCTURE</small></Link>
        <nav aria-label="Primary navigation"><Link href="/about">What is BBBT?</Link><Link href="/riders">For Riders</Link><Link href="/safety">Safety</Link><Link href="/community">Community</Link><Link href="/care-pits">Care Pit</Link><Link href="/investor">Investor Brief</Link></nav>
        <div className="v2-nav-actions"><Link href="/login">Login</Link><Link className="v2-button v2-button-red" href="/signup">Join BBBT</Link></div>
      </header>

      <section className="v2-hero">
        <div className="v2-hero-copy"><p className="v2-kicker">A safety infrastructure for the road ahead</p><h1>Ride free.<br /><em>Return safer.</em></h1><p className="v2-lede">BBBT is building the layer between a rider, their community, and the support they need on every journey.</p><div className="v2-actions"><Link className="v2-button v2-button-red" href="/signup">Start your rider identity <span>↗</span></Link><Link className="v2-text-link" href="/how-it-works">See how it works <span>↓</span></Link></div><p className="v2-status"><span /> PROTOTYPE / PHASE 1A &nbsp;·&nbsp; No emergency response is live</p></div>
        <div className="v2-hero-art" role="img" aria-label="Motorcyclist riding on an open highway"><div className="v2-scanline" /><div className="v2-art-label">N 28°36&apos; &nbsp; / &nbsp; E 77°13&apos;</div><div className="v2-art-stamp">ROAD<br /><strong>READY</strong></div></div>
      </section>

      <section className="v2-intro v2-section"><div><p className="v2-kicker">Not another riding club</p><h2>The road is a system.<br /><span>So is safety.</span></h2></div><div className="v2-intro-copy"><p>Riders already look after one another. BBBT gives that instinct a structure: one identity, useful training, route-side support, and a community that knows how to show up.</p><Link className="v2-text-link" href="/about">Understand the model <span>↗</span></Link></div></section>

      <section className="v2-pillars v2-section"><div className="v2-section-head"><p className="v2-kicker">The BBBT protocol</p><span>01 — 03</span></div><div className="v2-pillar-grid">{pillars.map(([num, title, copy]) => <article className="v2-pillar" key={num}><b>{num}</b><h3>{title}</h3><p>{copy}</p><Link href={title === 'Safety identity' ? '/riders' : title === 'Community layer' ? '/community' : '/care-pits'}>Explore <span>↗</span></Link></article>)}</div></section>

      <section className="v2-route"><div className="v2-route-image" aria-hidden="true" /><div className="v2-route-copy"><p className="v2-kicker">From the first mile</p><h2>Make readiness<br /><span>a ritual.</span></h2><p>Every rider starts somewhere. BBBT turns the things that matter into a simple sequence you can return to before, during, and after the ride.</p><div className="v2-route-steps"><span>IDENTITY</span><i>→</i><span>READY</span><i>→</i><span>CONNECTED</span></div><Link className="v2-button v2-button-outline" href="/how-it-works">Walk the route</Link></div></section>

      <section className="v2-audience v2-section"><div className="v2-section-head"><div><p className="v2-kicker">Find your place</p><h2>Built around<br /><span>real riders.</span></h2></div><p>One ecosystem. Different ways to contribute.</p></div><div className="v2-audience-grid">{audiences.map(([title, copy, href]) => <Link className="v2-audience-card" href={href} key={title}><span>↗</span><h3>{title}</h3><p>{copy}</p></Link>)}</div></section>

      <section className="v2-split"><div className="v2-trust"><p className="v2-kicker">BBBT Trust</p><h2>People first.<br /><span>Always.</span></h2><p>Safety, welfare, learning, community accountability, and the rider support layer.</p><Link href="/safety">Explore the Trust ↗</Link></div><div className="v2-holding"><p className="v2-kicker">BBBT Holding</p><h2>Ideas into<br /><span>infrastructure.</span></h2><p>Future products, technology, research, partnerships, and the commercial layer.</p><Link href="/partners">Explore the Holding ↗</Link></div></section>

      <section className="v2-faq v2-section"><div><p className="v2-kicker">Questions worth answering</p><h2>Start with<br /><span>clarity.</span></h2></div><div>{['What is BBBT right now?', 'Is emergency response live?', 'What happens when I join?'].map((q, i) => <div className="v2-faq-item" key={q}><button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}><span>0{i + 1}</span>{q}<b>{openFaq === i ? '−' : '+'}</b></button>{openFaq === i && <p>{i === 0 ? 'BBBT is a prototype of a rider safety and community infrastructure ecosystem. The model is being built in phases.' : i === 1 ? 'No. SOS, dispatch, Blood Mesh, live Care Pit availability, and emergency coordination are future concepts—not live services.' : 'You create a rider identity, choose your role, and see the next readiness action. Role requests are reviewed; they do not grant authority automatically.'}</p>}</div>)}</div></section>

      <footer className="v2-footer"><div><div className="v2-brand"><span>BBBT</span><small>RIDER INFRASTRUCTURE</small></div><p>For every rider who believes<br />the road can be better.</p></div><div className="v2-footer-links"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link><Link href="/login">Login ↗</Link></div><small>PROTOTYPE / INDIA / 2026</small></footer>
    </main>
  )
}
