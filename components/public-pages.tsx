'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Cta, Hero, Shell, StatusBadge } from '@/components/public-site'
import { CrystalAlert, CrystalBadge, CrystalTabs, type BadgeStatus } from '@/components/ui/crystal'
import {
  ArrowRight, ChevronDown, ChevronRight, ShieldCheck, Siren, Network, Wrench, Route, MapPin,
  BadgeCheck, Landmark, Bike, Users, HeartPulse, Coffee, Hotel, Fuel, Stethoscope, Eye, Moon,
  Sun, Signpost, Gauge, TriangleAlert, GraduationCap, ClipboardCheck, FlaskConical, Handshake,
  Store, Cross, ScrollText, Award, ShieldAlert, Cpu, LifeBuoy, Mail, Flag, Milestone,
} from 'lucide-react'
import '../app/design-system/crystal.css'
import './public-pages.css'

/* ---------------- shared building blocks ---------------- */

type Icon = typeof ShieldCheck
type Sig = 'red' | 'orange' | 'blue' | 'green' | 'white'

/** Honest status labels mapped onto the reused crystal badge signal system. */
const statusMap: Record<string, BadgeStatus> = {
  LIVE: 'success', DEMO: 'information', PROTOTYPE: 'warning', SIMULATION: 'warning',
  PLANNED: 'information', FUTURE: 'inactive', PROPOSED: 'inactive', CONCEPT: 'inactive',
}
function Status({ children }: { children: string }) {
  return <CrystalBadge status={statusMap[children] ?? 'information'}>{children}</CrystalBadge>
}

function PageFrame({
  label, title, lede, ctaHref = '/contact', ctaLabel = 'Start a conversation', children,
}: {
  label: string; title: string; lede: string; ctaHref?: string; ctaLabel?: string; children: React.ReactNode
}) {
  return (
    <Shell>
      <main className="pp">
        <Hero label={label} title={title} lede={lede}><Cta href={ctaHref}>{ctaLabel}</Cta></Hero>
        <div className="bcx pp-body">{children}</div>
      </main>
    </Shell>
  )
}

function Head({ eyebrow, title, lede, split }: { eyebrow: string; title: string; lede?: string; split?: React.ReactNode }) {
  if (split) {
    return (
      <div className="pp-head pp-head--split">
        <div><p className="bcx-eyebrow">{eyebrow}</p><h2>{title}</h2>{lede && <p>{lede}</p>}</div>
        <div>{split}</div>
      </div>
    )
  }
  return <div className="pp-head"><p className="bcx-eyebrow">{eyebrow}</p><h2>{title}</h2>{lede && <p>{lede}</p>}</div>
}

function InfoCard({ icon: I, title, body, status, accent = 'blue' }: { icon: Icon; title: string; body: string; status: string; accent?: Sig }) {
  return (
    <article className="bcx-card bcx-card--l2 pp-card" style={{ ['--bcx-accent' as string]: `var(--bcx-${accent})`, display: 'flex', flexDirection: 'column' }}>
      <span className="pp-card-icon"><I size={20} aria-hidden="true" /></span>
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="pp-card__foot"><Status>{status}</Status></div>
    </article>
  )
}

function Band({ title, text, href = '/contact', label = 'Start a conversation' }: { title: string; text: string; href?: string; label?: string }) {
  return (
    <div className="pp-band bcx">
      <div className="pp-band__inner">
        <div><h2>{title}</h2><p>{text}</p></div>
        <Cta href={href}>{label}</Cta>
      </div>
    </div>
  )
}

/* ============================================================ ABOUT */
function AboutPage() {
  return (
    <PageFrame
      label="About BBBT Trust"
      title="Why BBBT exists."
      lede="BBBT Trust is being designed as the non-profit safety, community and governance layer for India's riding communities — a structure that turns rider goodwill into accountable support."
    >
      <section className="pp-section">
        <Head eyebrow="The rider reality" title="The road already tests every rider." lede="Long-distance riding in India carries real, repeated gaps. BBBT starts by naming them honestly." />
        <div className="pp-reality">
          <div><b>UNCERTAINTY</b><p>Long corridors with little reliable information about what lies ahead — weather, road quality or safe stops.</p></div>
          <div><b>FRAGMENTED SUPPORT</b><p>Help exists, but it is scattered across groups, chats and memory instead of a trusted, structured layer.</p></div>
          <div><b>SAFETY GAPS</b><p>Preparation, readiness and response are left to individual habit rather than shared, teachable practice.</p></div>
        </div>
      </section>

      <section className="pp-section pp-section--alt">
        <Head eyebrow="What BBBT adds" title="Four foundations, built around riders." />
        <div className="pp-grid pp-grid--4">
          <InfoCard icon={ShieldCheck} title="Safety" body="Build readiness and education into everyday riding." status="PLANNED" accent="green" />
          <InfoCard icon={Users} title="Community" body="Make rider experience part of how decisions are made." status="PLANNED" accent="blue" />
          <InfoCard icon={Landmark} title="Governance" body="Keep future administration transparent and accountable." status="PROPOSED" accent="white" />
          <InfoCard icon={HeartPulse} title="Welfare" body="A clearer path to trusted, human support when it matters." status="PROPOSED" accent="red" />
        </div>
      </section>

      <section className="pp-section">
        <Head eyebrow="Two structures, one ecosystem" title="Trust and Holding stay distinct — on purpose." />
        <div className="pp-th">
          <div className="pp-th__panel" style={{ ['--bcx-accent' as string]: 'var(--bcx-green)' }}>
            <p className="pp-role">BBBT Trust · Non-profit layer</p>
            <h3>Safety, community, governance, welfare</h3>
            <ul>
              <li>Rider safety education and readiness</li>
              <li>Community participation and representation</li>
              <li>Transparent governance and accountability</li>
              <li>Rider welfare and support</li>
            </ul>
          </div>
          <div className="pp-th__panel" style={{ ['--bcx-accent' as string]: 'var(--bcx-blue)' }}>
            <p className="pp-role">BBBT Holding · Commercial layer</p>
            <h3>Commercial, products, technology, BBBT Shop</h3>
            <ul>
              <li>Products and rider technology</li>
              <li>Research and development</li>
              <li>Partnerships and commercial operations</li>
              <li>The future BBBT Shop</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="pp-section pp-section--alt">
        <Head eyebrow="Contribution" title="Experience from the road shapes what comes next." lede="Experienced riders and local communities are intended to contribute knowledge, testing and honest feedback through the Founding Rider Council — a contribution layer, not an ownership claim." />
        <Link className="pp-route__go" href="/signup?role=Founding%20Rider%20Council%20Member" style={{ color: 'var(--bcx-blue)' }}>Explore the Founding Rider Council <ChevronRight size={15} /></Link>
      </section>

      <section className="pp-section">
        <Head eyebrow="Long-term vision" title="Built in controlled, honest phases." />
        <div className="pp-timeline">
          <div><span className="pp-phase">PHASE · NOW</span><div><h4>Prototype foundation</h4><p>A public prototype that explains the intended direction without simulating live services.</p></div></div>
          <div><span className="pp-phase">PHASE · NEXT</span><div><h4>Controlled community</h4><p>Structured rider participation, group admins and the Founding Rider Council.</p></div></div>
          <div><span className="pp-phase">PHASE · LATER</span><div><h4>Verified support network</h4><p>Care Pits, marshals and readiness tooling introduced in careful, verified stages.</p></div></div>
          <div><span className="pp-phase">FUTURE</span><div><h4>Products and BBBT Shop</h4><p>Rider technology and commercial products delivered through BBBT Holding.</p></div></div>
        </div>
      </section>

      <Band title="Want to shape a safer riding culture?" text="Start a controlled conversation with BBBT. This prototype does not create an account or collect payment." />
    </PageFrame>
  )
}

/* ============================================================ SAFETY */
const safetyPhases = [
  { id: 'before', label: 'Before the ride' },
  { id: 'during', label: 'During the ride' },
  { id: 'wrong', label: 'When something goes wrong' },
  { id: 'after', label: 'After the incident' },
]
const safetyScenarios: Record<string, { icon: Icon; title: string; body: string; status: string; accent: Sig }[]> = {
  before: [
    { icon: ShieldCheck, title: 'Helmet & protective gear', body: 'Gear checks and fit guidance as a non-negotiable first step.', status: 'PROTOTYPE', accent: 'green' },
    { icon: ClipboardCheck, title: 'Safety Kit', body: 'A proposed essential kit checklist for long-distance corridors.', status: 'PLANNED', accent: 'blue' },
    { icon: Gauge, title: 'Fatigue & readiness', body: 'Simple self-checks before committing to a long ride.', status: 'PLANNED', accent: 'orange' },
    { icon: GraduationCap, title: 'Training', body: 'Structured learning for responsible, defensive riding.', status: 'FUTURE', accent: 'white' },
  ],
  during: [
    { icon: Eye, title: 'Mirrors & blind spots', body: 'Habits for constant awareness of what is around you.', status: 'PROTOTYPE', accent: 'blue' },
    { icon: Sun, title: 'Day riding', body: 'Visibility, spacing and reading fast highway traffic.', status: 'PROTOTYPE', accent: 'orange' },
    { icon: Moon, title: 'Night riding', body: 'Lighting, reflectivity and fatigue management after dark.', status: 'PLANNED', accent: 'white' },
    { icon: Users, title: 'Group riding', body: 'Formation, signalling and keeping a group safe together.', status: 'PLANNED', accent: 'green' },
    { icon: Signpost, title: 'Road signs & markings', body: 'Reading corridors correctly to anticipate risk early.', status: 'FUTURE', accent: 'blue' },
  ],
  wrong: [
    { icon: Siren, title: 'Emergency readiness', body: 'Knowing your plan before a ride turns critical.', status: 'FUTURE', accent: 'red' },
    { icon: LifeBuoy, title: 'SOS / alert concept', body: 'A proposed structured escalation flow — not a live service.', status: 'SIMULATION', accent: 'red' },
    { icon: MapPin, title: 'Nearest Care Pit', body: 'Orienting toward a proposed verified support location.', status: 'PROTOTYPE', accent: 'orange' },
  ],
  after: [
    { icon: ScrollText, title: 'Incident record', body: 'Capturing what happened to help riders learn.', status: 'FUTURE', accent: 'white' },
    { icon: HeartPulse, title: 'Recovery support', body: 'A future path to welfare and community help.', status: 'FUTURE', accent: 'red' },
    { icon: Network, title: 'Community feedback', body: 'Turning real incidents into better shared practice.', status: 'PLANNED', accent: 'blue' },
  ],
}
function SafetyPage() {
  const [phase, setPhase] = useState('before')
  return (
    <PageFrame
      label="Rider Safety Infrastructure"
      title="Safety should be part of the ride — not an afterthought."
      lede="A proposed safety system organised around the real timeline of a ride: before you leave, on the road, when something goes wrong, and after."
    >
      <section className="pp-section">
        <Head eyebrow="The safety timeline" title="Follow the ride, stage by stage." lede="Every capability below is labelled honestly. Nothing here is presented as live coverage or a guaranteed response." />
        <CrystalTabs tabs={safetyPhases} value={phase} onValueChange={setPhase} accent="green" />
        <div className="pp-scenarios">
          {safetyScenarios[phase].map((s) => <InfoCard key={s.title} {...s} />)}
        </div>
        <div className="pp-chips">
          {['Helmet', 'Mirrors', 'Blind spots', 'Day riding', 'Night riding', 'Group riding', 'Road signs', 'Road markings', 'Fatigue', 'Emergency readiness', 'Safety Kit', 'Training'].map((t) => <span key={t} className="pp-chip">{t}</span>)}
        </div>
      </section>

      <section className="pp-section pp-section--alt">
        <CrystalAlert tone="warning" icon={<TriangleAlert size={18} aria-hidden="true" />} title="This is a safety prototype">
          BBBT does not currently provide live safety guarantees, coverage or emergency response. These modules describe the intended direction only.
        </CrystalAlert>
      </section>

      <Band title="Help build rider safety that actually teaches." text="Riders with real experience shape these modules through the Founding Rider Council." href="/signup?role=Founding%20Rider%20Council%20Member" label="Explore the Council" />
    </PageFrame>
  )
}

/* ============================================================ EMERGENCY */
const emergencyFlow: { n: string; title: string; body: string; accent: Sig }[] = [
  { n: '01', title: 'Rider', body: 'A rider on a long corridor, prepared before the ride.', accent: 'white' },
  { n: '02', title: 'Problem', body: 'Breakdown, incident or medical situation on the route.', accent: 'red' },
  { n: '03', title: 'SOS / Alert', body: 'A proposed fast-entry alert with location and context.', accent: 'red' },
  { n: '04', title: 'Verified network', body: 'Marshals and trusted nodes receive a structured signal.', accent: 'blue' },
  { n: '05', title: 'Care Pit / support', body: 'The nearest proposed support point coordinates help.', accent: 'green' },
]
function EmergencyPage() {
  return (
    <PageFrame
      label="SOS & Emergency Support"
      title="A clearer response path when a ride turns critical."
      lede="BBBT is exploring an emergency-support framework that connects a rider, their contacts and future support nodes into one structured flow."
      ctaLabel="Prepare with BBBT"
    >
      <section className="pp-section pp-section--tight">
        <CrystalAlert tone="emergency" icon={<ShieldAlert size={18} aria-hidden="true" />} title="This prototype does not provide live emergency response">
          Nothing on this page dispatches help. In a real emergency, always call official services (112 in India). The flow below is a simulation of an intended future system.
        </CrystalAlert>
      </section>

      <section className="pp-section pp-section--tight">
        <Head eyebrow="Intended response flow" title="From rider to support, in five stages." split={<Status>SIMULATION</Status>} />
        <div className="pp-flow">
          {emergencyFlow.map((f, i) => (
            <div className="pp-flow__node" key={f.n} style={{ ['--bcx-accent' as string]: `var(--bcx-${f.accent})` }}>
              <span className="pp-flow__n">{f.n}</span>
              <h4>{f.title}</h4>
              <p>{f.body}</p>
              {i < emergencyFlow.length - 1
                ? <ArrowRight className="pp-flow__arrow" size={16} aria-hidden="true" />
                : <span className="pp-flow__end">ENDPOINT</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="pp-section">
        <Head eyebrow="Readiness components" title="What a rider could prepare in advance." />
        <div className="pp-grid pp-grid--3">
          <InfoCard icon={Users} title="Emergency contacts" body="Important people prepared and reachable before the ride begins." status="PLANNED" accent="blue" />
          <InfoCard icon={MapPin} title="Location sharing" body="A proposed way to share relevant location and ride context." status="FUTURE" accent="orange" />
          <InfoCard icon={Flag} title="Marshal support" body="Trusted regional riders as a future structured response layer." status="FUTURE" accent="green" />
          <InfoCard icon={LifeBuoy} title="Care Pit link" body="Routing toward the nearest proposed verified support point." status="PROTOTYPE" accent="orange" />
          <InfoCard icon={HeartPulse} title="Blood Mesh concept" body="A future, consent-led blood-support network idea." status="FUTURE" accent="red" />
          <InfoCard icon={Cross} title="Healthcare concept" body="A future directory linking riders to nearby medical help." status="FUTURE" accent="red" />
        </div>
      </section>

      <Band title="Emergency support must be earned, not claimed." text="We are building this carefully and honestly. Talk to BBBT about the intended emergency framework." />
    </PageFrame>
  )
}

/* ============================================================ CARE PITS */
type Pit = { id: string; icon: Icon; name: string; cat: string; accent: Sig; x: number; y: number; services: string[]; distance: string; status: string }
const pits: Pit[] = [
  { id: 'dhaba', icon: Store, name: 'Highway Dhaba', cat: 'Dhaba', accent: 'orange', x: 12, y: 44, services: ['Food', 'Rest', 'Water'], distance: '~ demo', status: 'DEMO' },
  { id: 'cafe', icon: Coffee, name: 'Roadside Café', cat: 'Cafe', accent: 'orange', x: 26, y: 62, services: ['Coffee', 'Rest', 'Wi-Fi'], distance: '~ demo', status: 'DEMO' },
  { id: 'service', icon: Wrench, name: 'Service & Pit', cat: 'Service / Pit', accent: 'blue', x: 40, y: 40, services: ['Repairs', 'Tyres', 'Tools'], distance: '~ demo', status: 'PROTOTYPE' },
  { id: 'petrol', icon: Fuel, name: 'Petrol Pump', cat: 'Petrol Pump', accent: 'white', x: 54, y: 60, services: ['Fuel', 'Air', 'Restroom'], distance: '~ demo', status: 'DEMO' },
  { id: 'medical', icon: Cross, name: 'Medical Store', cat: 'Medical Store', accent: 'red', x: 68, y: 42, services: ['First aid', 'Pharmacy'], distance: '~ demo', status: 'PROTOTYPE' },
  { id: 'hotel', icon: Hotel, name: 'Hotel / Resort', cat: 'Hotel / Resort', accent: 'blue', x: 82, y: 62, services: ['Stay', 'Secure parking'], distance: '~ demo', status: 'PLANNED' },
  { id: 'health', icon: Stethoscope, name: 'Healthcare Partner', cat: 'Healthcare Partner', accent: 'green', x: 92, y: 46, services: ['Clinic', 'Emergency link'], distance: '~ demo', status: 'FUTURE' },
]
function CarePitsPage() {
  const [active, setActive] = useState('service')
  const pit = pits.find((p) => p.id === active) ?? pits[0]
  return (
    <PageFrame
      label="Care Pit Network"
      title="A human support layer along the highway."
      lede="Care Pits are proposed verified rider-support locations built around real places people already use — dhabas, cafés, service points, fuel stops and medical help."
      ctaLabel="Partner a Care Pit"
    >
      <section className="pp-section">
        <Head eyebrow="Conceptual network" title="Tap a node on the corridor." lede="A conceptual view only. No location is claimed as verified or operational, and no coverage numbers are real." />
        <div className="pp-map">
          <div className="pp-map__canvas" role="group" aria-label="Conceptual Care Pit corridor">
            <span className="pp-map__label">CORRIDOR · DEMO</span>
            <div className="pp-map__route" aria-hidden="true" />
            <div className="pp-map__nodes">
              {pits.map((p) => (
                <button
                  key={p.id}
                  className="pp-map__pin"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, ['--bcx-accent' as string]: `var(--bcx-${p.accent})` }}
                  aria-pressed={active === p.id}
                  aria-label={`${p.name} (${p.cat})`}
                  onClick={() => setActive(p.id)}
                >
                  <p.icon size={16} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
          <div className="pp-map__detail" style={{ ['--bcx-accent' as string]: `var(--bcx-${pit.accent})` }}>
            <p className="pp-cat">{pit.cat}</p>
            <h4>{pit.name}</h4>
            <dl>
              <dt>Status</dt><dd><Status>{pit.status}</Status></dd>
              <dt>Distance</dt><dd>{pit.distance}</dd>
              <dt>Access</dt><dd>QR concept</dd>
            </dl>
            <div className="pp-map__services">{pit.services.map((s) => <span key={s} className="pp-chip">{s}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="pp-section pp-section--alt">
        <Head eyebrow="Node categories" title="Built around places riders already trust." />
        <div className="pp-grid pp-grid--4">
          <InfoCard icon={Store} title="Dhaba & café" body="Rest, orient and reconnect with the road." status="PLANNED" accent="orange" />
          <InfoCard icon={Wrench} title="Service & pit" body="Practical support for rider and machine." status="PROTOTYPE" accent="blue" />
          <InfoCard icon={Fuel} title="Fuel & essentials" body="Petrol pumps and everyday stop needs." status="DEMO" accent="white" />
          <InfoCard icon={Cross} title="Medical & healthcare" body="A future directory of nearby help." status="FUTURE" accent="red" />
        </div>
      </section>

      <Band title="Run a highway stop riders rely on?" text="Care Pit partnerships are explored carefully. Start a conversation about future collaboration." label="Talk about partnership" />
    </PageFrame>
  )
}

/* ============================================================ COMMUNITY */
function CommunityPage() {
  return (
    <PageFrame
      label="Rider Community"
      title="The road is shared. The knowledge should be too."
      lede="BBBT does not replace rider communities — it adds structure around them, connecting riders and local groups through safety, training and mutual support."
      ctaLabel="Join the community"
    >
      <section className="pp-section">
        <Head eyebrow="Our position" title="Structure around community — not a replacement for it." lede="Riding groups already carry culture, trust and local knowledge. BBBT is a participation layer for the people who want to make that safer and more useful." />
        <div className="pp-grid pp-grid--4">
          <InfoCard icon={Bike} title="Rider" body="The individual at the centre of every decision." status="PLANNED" accent="white" />
          <InfoCard icon={Users} title="Group" body="Local riding communities and their existing culture." status="PLANNED" accent="blue" />
          <InfoCard icon={Flag} title="Marshal" body="Trusted regional riders supporting safety on the ground." status="FUTURE" accent="orange" />
          <InfoCard icon={Landmark} title="Council" body="Experienced riders contributing intelligence and feedback." status="PROPOSED" accent="green" />
        </div>
      </section>

      <section className="pp-section pp-section--alt">
        <Head
          eyebrow="Group Admin"
          title="Local groups get real responsibility."
          split={<img src="/india-rider-safety.png" alt="Indian riders preparing safety gear before a group ride" style={{ width: '100%', maxWidth: 420, borderRadius: 'var(--bcx-r-lg)', border: '1px solid var(--bcx-line)' }} />}
          lede="A Group Admin is intended to help organise their community responsibly — coordinating members, sharing safety practice and channelling honest feedback into the wider ecosystem."
        />
        <div className="pp-loop">
          <span className="pp-loop__step"><b>START</b>Community</span>
          <ChevronRight className="pp-loop__arrow" size={18} aria-hidden="true" />
          <span className="pp-loop__step"><b>ADDS</b>Safety</span>
          <ChevronRight className="pp-loop__arrow" size={18} aria-hidden="true" />
          <span className="pp-loop__step"><b>PRODUCES</b>Intelligence</span>
        </div>
      </section>

      <section className="pp-section">
        <Head eyebrow="What the community builds" title="Knowledge that compounds." />
        <div className="pp-grid pp-grid--3">
          <InfoCard icon={GraduationCap} title="Training & knowledge" body="Share useful, responsible riding practice between members." status="FUTURE" accent="blue" />
          <InfoCard icon={ShieldCheck} title="Safety culture" body="Make preparation and readiness a group habit, not a solo one." status="PLANNED" accent="green" />
          <InfoCard icon={Network} title="Community intelligence" body="Turn real rider feedback into better shared decisions." status="PROTOTYPE" accent="orange" />
        </div>
      </section>

      <Band title="Bring your riding group into BBBT." text="Group admins and partners can start a controlled conversation about local participation." label="Connect your group" />
    </PageFrame>
  )
}

/* ============================================================ FOUNDING RIDER COUNCIL */
const councilLoop = ['Rider problem', 'Council intelligence', 'Research', 'Prototype', 'Field test', 'Feedback', 'Better product']
function CouncilPage() {
  return (
    <PageFrame
      label="Founding Rider Council"
      title="Experience from the road, shaping what comes next."
      lede="A proposed contribution layer for experienced riders and community leaders with deep, real-world knowledge of long-distance riding in India."
      ctaLabel="Express interest"
    >
      <section className="pp-section">
        <Head eyebrow="What it is" title="Rider intelligence — not a co-founder title." lede="The Founding Rider Council is a way for experienced riders to contribute expertise, testing and honest feedback. It is not a co-founder role." />
        <div className="pp-grid pp-grid--3">
          <InfoCard icon={BadgeCheck} title="What is Council?" body="A structured group of experienced riders contributing real-world knowledge to BBBT." status="PROPOSED" accent="green" />
          <InfoCard icon={Users} title="Who can apply?" body="Riders and community leaders with deep long-distance and group experience." status="PLANNED" accent="blue" />
          <InfoCard icon={Route} title="Why experience matters" body="Good rider tooling has to be shaped by people who have ridden the hard miles." status="PROPOSED" accent="orange" />
        </div>
      </section>

      <section className="pp-section pp-section--alt">
        <Head eyebrow="What Council contributes" title="Contribution, across the product." />
        <div className="pp-grid pp-grid--3">
          <InfoCard icon={GraduationCap} title="Training contribution" body="Help shape safety education and rider training." status="FUTURE" accent="green" />
          <InfoCard icon={ClipboardCheck} title="Product testing" body="Responsibly test future rider tools in the field." status="FUTURE" accent="blue" />
          <InfoCard icon={FlaskConical} title="Research" body="Bring lived experience into research and development." status="PLANNED" accent="orange" />
          <InfoCard icon={HeartPulse} title="Rider feedback" body="Represent real riding pain points honestly." status="PLANNED" accent="red" />
          <InfoCard icon={Network} title="Community intelligence" body="Channel community needs into better decisions." status="PROTOTYPE" accent="blue" />
          <InfoCard icon={Landmark} title="Governance contribution" body="Support transparent, accountable decision-making." status="PROPOSED" accent="white" />
        </div>
      </section>

      <section className="pp-section">
        <Head eyebrow="The intelligence loop" title="From rider problem to a better ride." />
        <div className="pp-loop">
          {councilLoop.map((step, i) => (
            <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="pp-loop__step"><b>{`0${i + 1}`}</b>{step}</span>
              {i < councilLoop.length - 1 && <ChevronRight className="pp-loop__arrow" size={18} aria-hidden="true" />}
            </span>
          ))}
        </div>
      </section>

      <section className="pp-section pp-section--alt">
        <Head eyebrow="How contribution is protected" title="Clear boundaries, honestly stated." />
        <div className="pp-grid pp-grid--3">
          <InfoCard icon={ScrollText} title="NDA / IP concept" body="A future framework to protect shared ideas and BBBT IP." status="CONCEPT" accent="blue" />
          <InfoCard icon={Handshake} title="Conflict-of-interest concept" body="A future policy to keep contribution fair and transparent." status="CONCEPT" accent="orange" />
          <InfoCard icon={Award} title="Recognition concept" body="A future way to recognise meaningful rider contribution." status="CONCEPT" accent="green" />
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <CrystalAlert tone="warning" icon={<TriangleAlert size={18} aria-hidden="true" />} title="Important boundaries">
            Council members are not called co-founders. No ownership, equity, commission or financial return is promised at this stage. This is a contribution and recognition layer only.
          </CrystalAlert>
        </div>
      </section>

      <Band title="Ridden the hard miles? Bring that knowledge in." text="Express interest in the Founding Rider Council. This does not create membership or promise any return." label="Express interest" />
    </PageFrame>
  )
}

/* ============================================================ INFO PAGE ROUTER */
const pageMap = {
  about: AboutPage,
  safety: SafetyPage,
  emergency: EmergencyPage,
  'care-pits': CarePitsPage,
  community: CommunityPage,
  'founding-rider-council': CouncilPage,
}
export function InfoPage({ kind }: { kind: keyof typeof pageMap }) {
  const Page = pageMap[kind]
  return <Page />
}

/* ============================================================ HOW IT WORKS */
const stages: { n: string; title: string; body: string; status: string; accent: Sig }[] = [
  { n: '01', title: 'Rider', body: 'A rider with real experience and local knowledge.', status: 'LIVE', accent: 'white' },
  { n: '02', title: 'Identify', body: 'A problem or need is recognised on the route.', status: 'PROTOTYPE', accent: 'orange' },
  { n: '03', title: 'Alert', body: 'A proposed structured signal — not a live service.', status: 'SIMULATION', accent: 'red' },
  { n: '04', title: 'Verified network', body: 'Trusted marshals and nodes coordinate a response.', status: 'FUTURE', accent: 'blue' },
  { n: '05', title: 'Care Pit', body: 'The nearest proposed support point adds practical help.', status: 'PROTOTYPE', accent: 'orange' },
  { n: '06', title: 'Support', body: 'Human welfare and follow-up around the rider.', status: 'FUTURE', accent: 'green' },
  { n: '07', title: 'Intelligence', body: 'Real feedback informs research and decisions.', status: 'PLANNED', accent: 'blue' },
  { n: '08', title: 'Future products', body: 'Better rider tools delivered through BBBT Holding.', status: 'FUTURE', accent: 'white' },
]
export function HowItWorks() {
  return (
    <PageFrame
      label="How BBBT works"
      title="A connected ecosystem, built in clear stages."
      lede="The proposed BBBT flow starts with rider experience and grows through community responsibility, safety infrastructure and careful research."
      ctaHref="/#join"
      ctaLabel="Choose your path"
    >
      <section className="pp-section">
        <Head eyebrow="The flow" title="From the road to better tools." lede="Each stage is labelled honestly so a simulation is never mistaken for a live emergency system." />
        <div className="pp-stages">
          {stages.map((s) => (
            <div className="pp-stage" key={s.n} style={{ ['--bcx-accent' as string]: `var(--bcx-${s.accent})` }}>
              <span className="pp-stage__n">{s.n}</span>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
              <div className="pp-stage__status"><Status>{s.status}</Status></div>
            </div>
          ))}
        </div>
      </section>

      <section className="pp-section pp-section--alt">
        <CrystalAlert tone="info" icon={<Cpu size={18} aria-hidden="true" />} title="A prototype, described honestly">
          Stages marked SIMULATION, PROTOTYPE, PLANNED or FUTURE are not live. They describe the intended ecosystem, not current coverage or guaranteed response.
        </CrystalAlert>
      </section>

      <Band title="Find where you fit in the flow." text="Riders, groups, councils and partners each enter BBBT differently." href="/#join" label="Choose your path" />
    </PageFrame>
  )
}

/* ============================================================ FAQ */
type QA = [string, string]
const faqCategories: { id: string; label: string; items: QA[] }[] = [
  { id: 'general', label: 'General', items: [
    ['What is BBBT?', 'BBBT, or Brand Biker Brotherhood Trust, is being designed as a safety, emergency-support, community and rider-welfare layer for India\u2019s riding communities.'],
    ['Is BBBT operational everywhere?', 'No. This website is a prototype foundation. Coverage, partners and live services will be introduced in controlled future phases.'],
    ['What is the difference between Trust and Holding?', 'BBBT Trust is the non-profit safety, community, governance and welfare layer. BBBT Holding is the commercial layer for products, technology and the future BBBT Shop.'],
  ] },
  { id: 'safety', label: 'Safety', items: [
    ['Does BBBT guarantee my safety?', 'No. BBBT provides safety education and readiness concepts. It does not guarantee safety or provide live coverage.'],
    ['Are the safety modules live?', 'They are labelled Prototype, Planned or Future. They describe the intended direction, not current services.'],
  ] },
  { id: 'membership', label: 'Membership / Pricing', items: [
    ['Is membership available now?', 'No. This prototype does not create accounts or take payment.'],
    ['Is final pricing shown?', 'No. Final membership pricing and token economics are intentionally not shown in this prototype.'],
  ] },
  { id: 'tokens', label: 'Tokens', items: [
    ['How do BBBT Tokens work?', 'The token concept is fixed at 10 BBBT Tokens = \u20b91, meaning 1 Token = \u20b90.10. This is a conceptual unit in the prototype.'],
    ['Can I buy tokens now?', 'No. Tokens are not on sale. No purchase, ledger or payment is active in this prototype.'],
  ] },
  { id: 'care-pit', label: 'Care Pit', items: [
    ['What is a Care Pit?', 'A proposed verified rider-support location such as a dhaba, service point, caf\u00e9, petrol pump or medical store.'],
    ['Are Care Pits verified today?', 'No. Care Pit locations shown are demo or prototype states, not verified or operational sites.'],
  ] },
  { id: 'council', label: 'Council', items: [
    ['Are Council members co-founders?', 'No. Founding Rider Council members are not co-founders and are not promised ownership, equity or financial returns.'],
    ['What does the Council do?', 'Council members are intended to contribute rider expertise, training input, product testing, research and honest feedback.'],
  ] },
  { id: 'group-admin', label: 'Group Admin', items: [
    ['What is a Group Admin?', 'A Group Admin helps organise a local riding community responsibly and channels feedback into the wider BBBT ecosystem.'],
    ['How does a group join?', 'Use the contact pathway to start a controlled conversation about local participation.'],
  ] },
  { id: 'marshal', label: 'Marshal', items: [
    ['What is a Marshal?', 'A proposed trusted regional rider who supports safety and future response coordination on the ground.'],
    ['Is the Marshal network live?', 'No. The Marshal layer is a future concept, not an active service.'],
  ] },
  { id: 'investor', label: 'Investor', items: [
    ['Can I invest now?', 'BBBT shares a controlled future-ecosystem brief. Use the investor pathway to start a careful conversation.'],
    ['Are returns promised?', 'No. Nothing on this prototype promises financial returns to any participant.'],
  ] },
  { id: 'prototype', label: 'Prototype', items: [
    ['Why is everything labelled?', 'So simulated systems are never confused with live emergency services. Labels include Live, Demo, Prototype, Simulation, Planned and Future.'],
    ['Is this a real emergency service?', 'No. BBBT does not provide live emergency response. In an emergency, always call official services (112 in India).'],
  ] },
]
function QAItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="pp-qa">
      <button aria-expanded={open} onClick={() => setOpen(!open)}><span>{q}</span><ChevronDown size={16} aria-hidden="true" /></button>
      {open && <p>{a}</p>}
    </div>
  )
}
export function FAQPage() {
  const [cat, setCat] = useState('general')
  const active = faqCategories.find((c) => c.id === cat) ?? faqCategories[0]
  return (
    <PageFrame
      label="Frequently asked questions"
      title="Clear answers. No inflated claims."
      lede="A prototype should be honest about what exists, what is planned and what still needs to be built."
      ctaLabel="Ask BBBT directly"
    >
      <section className="pp-section">
        <div className="pp-faq">
          <nav className="pp-faq__nav" aria-label="FAQ categories">
            {faqCategories.map((c, i) => (
              <button key={c.id} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                <span>{`0${i + 1}`.slice(-2)}</span>{c.label}
              </button>
            ))}
          </nav>
          <div className="pp-faq__list">
            <p className="pp-faq__cat-title">{active.label}</p>
            {active.items.map(([q, a]) => <QAItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      <Band title="Still have a question?" text="Reach the right BBBT pathway and start an honest conversation." label="Contact BBBT" />
    </PageFrame>
  )
}

/* ============================================================ CONTACT */
const contactRoutes: { who: string; title: string; body: string; href: string; label: string; accent: Sig; icon: Icon }[] = [
  { who: 'Rider', title: 'Safety & participation', body: 'Questions about riding safely and joining the community.', href: '/signup', label: 'Rider signup', accent: 'white', icon: Bike },
  { who: 'Group Admin', title: 'Bring your group', body: 'Coordinate a local riding community inside BBBT.', href: '/community', label: 'Community', accent: 'blue', icon: Users },
  { who: 'Marshal', title: 'On-ground safety', body: 'Support future response coordination in your region.', href: '/safety', label: 'Safety', accent: 'orange', icon: Flag },
  { who: 'Council', title: 'Rider intelligence', body: 'Contribute deep experience, testing and feedback.', href: '/founding-rider-council', label: 'Council', accent: 'green', icon: Landmark },
  { who: 'Investor', title: 'Future ecosystem', body: 'A controlled conversation about the BBBT brief.', href: '/investor', label: 'Investor brief', accent: 'blue', icon: Milestone },
  { who: 'Partner', title: 'Care Pit & safety', body: 'Collaborate on rider support and safety infrastructure.', href: 'mailto:connect@bbbt.in', label: 'Email BBBT', accent: 'orange', icon: Handshake },
  { who: 'General', title: 'Anything else', body: 'For any other question about BBBT and its direction.', href: 'mailto:connect@bbbt.in', label: 'Email BBBT', accent: 'white', icon: Mail },
]
export function ContactPage() {
  return (
    <PageFrame
      label="Contact BBBT"
      title="Start with the right conversation."
      lede="Choose the pathway closest to your work. This prototype does not expose private contact details or create a live support ticket."
      ctaHref="mailto:connect@bbbt.in"
      ctaLabel="Email BBBT"
    >
      <section className="pp-section">
        <Head eyebrow="Routing" title="What should you contact BBBT about?" lede="Pick the closest match and we will point you to the right next step." />
        <div className="pp-routes">
          {contactRoutes.map((r) => (
            <Link key={r.who} href={r.href} className="pp-route" style={{ ['--bcx-accent' as string]: `var(--bcx-${r.accent})` }}>
              <span className="pp-card-icon" style={{ ['--bcx-accent' as string]: `var(--bcx-${r.accent})` }}><r.icon size={20} aria-hidden="true" /></span>
              <span className="pp-route__who">{r.who}</span>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
              <span className="pp-route__go">{r.label} <ArrowRight size={14} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>
    </PageFrame>
  )
}
