import Link from 'next/link'
import { ArrowRight, CheckCircle2, MessageCircle, ShieldAlert } from 'lucide-react'
import { BBBTAssistant } from '@/components/bbbt-assistant'
import { Header, Footer, SectionLabel, StatusBadge } from '@/components/public-site'
import '../design-system/crystal.css'
import '../../components/public-pages.css'

export default function AssistantPage() {
  return (
    <div className="public-shell feature-experience">
      <Header />
      <main>
        <section className="feature-hero bcx">
          <div className="feature-hero__copy">
            <SectionLabel>BBBT VOICE ASSISTANT / PROTOTYPE</SectionLabel>
            <StatusBadge>PROTOTYPE</StatusBadge>
            <h1>Ask about <em>the road ahead.</em></h1>
            <p>Explore BBBT&apos;s safety concepts, community pathways and rider context through a conversational prototype. It explains the system; it does not dispatch help or replace professional advice.</p>
            <div className="feature-actions"><Link className="button button-red" href="#assistant-console">Try the assistant <ArrowRight aria-hidden="true" /></Link><Link className="text-link" href="/faq">Read the FAQ <ArrowRight aria-hidden="true" /></Link></div>
          </div>
          <div className="feature-signal-panel" aria-label="Assistant prototype status"><div className="feature-signal-panel__top"><span>CONVERSATION LAYER</span><span className="feature-signal-dot" /></div><MessageCircle size={48} aria-hidden="true" /><strong>Context before confidence.</strong><p>Ask what is available, what is proposed and what still needs to be built.</p></div>
        </section>
        <section className="feature-section bcx"><div className="feature-section__intro"><SectionLabel>WHAT IT IS</SectionLabel><h2>A calm interface for understanding BBBT.</h2><p>The assistant can help visitors navigate the public prototype, understand rider-safety ideas and find the right next step.</p></div><div className="feature-points"><article><CheckCircle2 aria-hidden="true" /><h3>Explain the ecosystem</h3><p>Understand SOS, Care Pits, rider groups, Blood Mesh and participation paths.</p></article><article><CheckCircle2 aria-hidden="true" /><h3>Point to the right path</h3><p>Move from a question to a safety guide, role signup, FAQ or controlled conversation.</p></article><article><ShieldAlert aria-hidden="true" /><h3>Keep boundaries visible</h3><p>No emergency dispatch, medical diagnosis, guaranteed coverage or private dashboard access.</p></article></div></section>
        <section id="assistant-console" className="feature-console bcx"><div className="feature-console__intro"><SectionLabel>SAFE PROTOTYPE DEMO</SectionLabel><h2>Ask a question about BBBT.</h2><p>Use plain language. Treat the responses as prototype guidance and verify urgent information with official services.</p></div><div className="feature-console__body"><BBBTAssistant /></div></section>
        <section className="feature-section feature-section--dark bcx"><div className="feature-section__intro"><SectionLabel>CONNECTED FEATURE PATHS</SectionLabel><h2>Keep exploring with context.</h2></div><div className="feature-links"><Link href="/emergency"><strong>SOS &amp; Emergency</strong><span>Simulation, not dispatch <ArrowRight aria-hidden="true" /></span></Link><Link href="/safety-guides"><strong>Navigation &amp; Weather</strong><span>Readiness and route guidance <ArrowRight aria-hidden="true" /></span></Link><Link href="/dashboard/bloodmesh"><strong>Blood Mesh</strong><span>Authorized dashboard prototype <ArrowRight aria-hidden="true" /></span></Link><Link href="/signup?role=Rider"><strong>Join BBBT</strong><span>Choose a rider pathway <ArrowRight aria-hidden="true" /></span></Link></div></section>
      </main>
      <Footer />
    </div>
  )
}

export const metadata = { title: 'BBBT Voice Assistant', description: 'Explore the BBBT rider-safety prototype through a conversational assistant.', robots: { index: true, follow: true } }
