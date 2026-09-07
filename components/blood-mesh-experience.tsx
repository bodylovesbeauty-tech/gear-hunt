'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Droplet, Heart, MapPin, Phone, Radio, ShieldAlert, ShieldCheck, Users } from 'lucide-react'
import Link from 'next/link'
import { BLOOD_COMPATIBILITY, BLOOD_GROUPS, useRiderContext } from '@/lib/use-rider-context'
import '@/components/blood-mesh-experience.css'

type Donor = { name: string; group: string; km: number; lastDonated: string; consented: boolean }

const DONOR_POOL: Donor[] = [
  { name: 'Vikas P.', group: 'O-', km: 1.4, lastDonated: '4 months ago', consented: true },
  { name: 'Sana R.', group: 'O-', km: 3.0, lastDonated: '2 months ago', consented: true },
  { name: 'Imran S.', group: 'O+', km: 2.1, lastDonated: '6 months ago', consented: true },
  { name: 'Farhan A.', group: 'O+', km: 4.5, lastDonated: '8 months ago', consented: false },
  { name: 'Neha K.', group: 'A-', km: 2.8, lastDonated: '5 months ago', consented: true },
  { name: 'Rahul D.', group: 'A+', km: 3.6, lastDonated: '3 months ago', consented: true },
  { name: 'Zoya M.', group: 'B-', km: 1.9, lastDonated: '7 months ago', consented: true },
  { name: 'Aditya V.', group: 'B+', km: 5.2, lastDonated: '9 months ago', consented: true },
  { name: 'Kabir S.', group: 'AB+', km: 4.1, lastDonated: '2 months ago', consented: true },
]

type RequestState = 'idle' | 'consent' | 'scanning' | 'sent'

export function BloodMeshExperience() {
  const rider = useRiderContext()
  const [expanded, setExpanded] = useState<number | null>(null)
  const [need, setNeed] = useState('O+')
  const [meshConsent, setMeshConsent] = useState(true)
  const [reqState, setReqState] = useState<RequestState>('idle')
  const [progress, setProgress] = useState(0)

  // Sync the requested group to the signed-in rider's own blood group once known.
  const activeNeed = need

  const compatibleGroups = BLOOD_COMPATIBILITY[activeNeed] ?? [activeNeed]
  const matches = useMemo(
    () => DONOR_POOL.filter((d) => compatibleGroups.includes(d.group) && d.consented).sort((a, b) => a.km - b.km),
    [compatibleGroups],
  )

  const runRequest = () => {
    if (!meshConsent) {
      setReqState('consent')
      return
    }
    setReqState('scanning')
    setProgress(0)
    const started = Date.now()
    const id = window.setInterval(() => {
      const p = Math.min(100, ((Date.now() - started) / 2000) * 100)
      setProgress(p)
      if (p >= 100) {
        window.clearInterval(id)
        setReqState('sent')
      }
    }, 40)
  }

  const reset = () => {
    setReqState('idle')
    setProgress(0)
  }

  const faqItems = [
    ['Is this hospital-grade matching?', 'No. Blood Mesh is a consent-led prototype. Never replace hospital typing with this tool.'],
    ['Are donors or hospitals connected?', 'No. This demo shows a request flow. No actual donor dispatch, hospital partnership or live matching exists.'],
    ['Will my blood type be public?', 'No. The public demo shows no personal data. Authorized Riders would record their information in private accounts.'],
    ['How does privacy work?', 'Blood group, location and consent state remain in authorized accounts only. Public visitors see no names, numbers or medical details.'],
    ['What if I refuse the request?', 'Refusal is valid at any step. Blood Mesh works only with explicit consent. No pressure, no tracking of refusal.'],
  ]

  return (
    <main className="bm-page">
      {/* Working console */}
      <section className="bm-console" aria-label="Blood Mesh console">
        <div className="bm-console__inner">
          <div className="bm-idbar">
            <div className="bm-id">
              <span className="bm-avatar" aria-hidden="true"><Droplet size={18} /></span>
              <div>
                <b>{rider.name}</b>
                <small>{rider.memberId}</small>
              </div>
            </div>
            <div className="bm-pills">
              <span className="bm-pill bm-pill--blood"><Droplet size={13} /> {rider.blood}</span>
              <span className={`bm-pill ${rider.kitActive ? 'bm-pill--kit' : 'bm-pill--kit-off'}`}><ShieldCheck size={13} /> {rider.kitActive ? 'Kit Active' : 'Kit Not Active'}</span>
              <span className="bm-pill"><MapPin size={13} /> {rider.location}</span>
            </div>
          </div>

          {!rider.authed && (
            <div className="bm-banner">
              <strong>DEMO VIEW</strong>
              <span>Showing sample rider data. No personal medical data is shared, and no real donors are contacted.</span>
              <Link href="/login?returnTo=/blood-mesh">Sign in to use your profile <ArrowRight size={13} /></Link>
            </div>
          )}

          <div className="bm-console__grid">
            <div className="bm-console__request">
              <span className="bm-eyebrow">CRITICAL SUPPORT REQUEST</span>
              <h2>Find compatible support, fast.</h2>
              <p className="bm-field-label">Blood group needed</p>
              <div className="bm-groups">
                {BLOOD_GROUPS.map((g) => (
                  <button key={g} type="button" className="bm-group-chip" aria-pressed={activeNeed === g} onClick={() => { setNeed(g); reset() }}>{g}</button>
                ))}
              </div>

              <div className="bm-compat">
                <span className="bm-field-label">Compatible donor groups</span>
                <div className="bm-compat__chips">
                  {compatibleGroups.map((g) => <span key={g} className="bm-compat__chip">{g}</span>)}
                </div>
                <small>Whole-blood donor compatibility for a {activeNeed} recipient.</small>
              </div>

              <label className="bm-consent">
                <input type="checkbox" checked={meshConsent} onChange={(e) => { setMeshConsent(e.target.checked); reset() }} />
                <span><b>My Blood Mesh participation is enabled.</b> A request is only broadcast to riders who have also consented.</span>
              </label>

              {reqState === 'idle' && (
                <button type="button" className="bm-request-btn" onClick={runRequest}>
                  <Radio size={16} /> Request {activeNeed} support
                </button>
              )}
              {reqState === 'consent' && (
                <div className="bm-alert" role="status">
                  Enable Blood Mesh participation above to broadcast a request. Consent is required at every step.
                  <button type="button" onClick={() => setReqState('idle')}>Dismiss</button>
                </div>
              )}
              {reqState === 'scanning' && (
                <div className="bm-scan" role="status" aria-live="polite">
                  <div className="bm-scan__bar"><i style={{ width: `${progress}%` }} /></div>
                  <span>Scanning {matches.length} consented donors within 6 km…</span>
                </div>
              )}
              {reqState === 'sent' && (
                <div className="bm-sent" role="status" aria-live="polite">
                  <CheckCircle2 size={18} />
                  <div>
                    <b>Request simulated to {matches.length} compatible riders.</b>
                    <span>Prototype only — no real donor is contacted and no medical data is shared. In a real emergency, hospital blood typing is always required.</span>
                  </div>
                  <button type="button" onClick={reset}>Reset</button>
                </div>
              )}

              <div className="bm-console__stats">
                <div><b>{matches.length}</b><span>Compatible nearby</span></div>
                <div><b>{compatibleGroups.length}</b><span>Donor groups</span></div>
                <div><b>6 km</b><span>Search radius</span></div>
              </div>
            </div>

            <div className="bm-console__donors">
              <div className="bm-donors__head">
                <span className="bm-eyebrow">LIVE MATCH PREVIEW</span>
                <span className="bm-donors__count">{matches.length} within 6 km</span>
              </div>
              {matches.length === 0 && <p className="bm-donors__empty">No consented compatible donors in range for {activeNeed}. Widen the radius or contact the nearest blood bank.</p>}
              <ul className="bm-donor-list">
                {matches.map((d) => (
                  <li key={d.name} className="bm-donor">
                    <span className="bm-donor__g">{d.group}</span>
                    <div className="bm-donor__body">
                      <b>{d.name}</b>
                      <small>{d.lastDonated}</small>
                    </div>
                    <div className="bm-donor__end">
                      <span className="bm-donor__km">{d.km} km</span>
                      <span className="bm-donor__badge">Consented</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="bm-carepit">
                <Phone size={14} />
                <div>
                  <b>Nearest blood bank</b>
                  <span>Lilavati Hospital Blood Bank · 4.1 km · 24/7</span>
                </div>
                <a href="tel:18002672288" aria-label="Call nearest blood bank"><Phone size={14} /></a>
              </div>
            </div>
          </div>
          <p className="bm-console__foot">Blood Mesh sits under SOS. Prototype / safe simulation — no medical verification, donor dispatch or hospital partnership is connected. In a real emergency call 112.</p>
        </div>
      </section>

      <header className="bm-hero" id="concept">
        <div className="bm-hero__content">
          <span className="bm-label">BLOOD MESH / CONSENT-LED SUPPORT</span>
          <h1>A concept for critical moments.</h1>
          <p>Blood Mesh explores how riders might understand a blood-support request without exposing private medical information or claiming hospital-grade matching.</p>
          <div className="bm-actions">
            <Link className="bm-button bm-button--primary" href="/signup?role=Rider">JOIN BBBT <ArrowRight size={16} /></Link>
            <Link className="bm-button" href="/sos">OPEN SOS</Link>
          </div>
        </div>
        <div className="bm-hero__visual">
          <div className="bm-visual-flow">
            <div className="bm-flow-step">
              <Users size={42} />
              <span>RIDER</span>
              <p>Blood group · consent</p>
            </div>
            <ArrowRight size={32} />
            <div className="bm-flow-step">
              <Radio size={42} />
              <span>BLOOD MESH</span>
              <p>Request match</p>
            </div>
            <ArrowRight size={32} />
            <div className="bm-flow-step">
              <Heart size={42} />
              <span>SUPPORT</span>
              <p>Concept only</p>
            </div>
          </div>
          <small className="bm-visual-note">PROTOTYPE · NO MEDICAL VERIFICATION · NO DONOR DISPATCH</small>
        </div>
      </header>

      <section className="bm-section">
        <span className="bm-label">WHY THIS PROTOTYPE</span>
        <h2>A critical moment should never be a mystery.</h2>
        <div className="bm-points">
          <article>
            <CheckCircle2 size={20} />
            <h3>Profile context</h3>
            <p>A future rider may record their own information in an authorized account. Blood group, allergies and emergency contacts become context, not assumptions.</p>
          </article>
          <article>
            <CheckCircle2 size={20} />
            <h3>Compatibility concept</h3>
            <p>If critical support is needed, the Blood Mesh network can propose nearby compatible matches. This demo shows the flow, not medical matching.</p>
          </article>
          <article>
            <CheckCircle2 size={20} />
            <h3>Privacy by design</h3>
            <p>Authorized riders own their data. The public demo shows no names, numbers or locations. Consent controls whether data is shared.</p>
          </article>
        </div>
      </section>

      <section className="bm-section">
        <span className="bm-label">KEY BOUNDARIES</span>
        <div className="bm-boundaries">
          <div className="bm-boundary">
            <ShieldAlert size={20} />
            <strong>No medical verification</strong>
            <p>Blood groups are self-reported in accounts. Hospital blood typing is always required before transfusion.</p>
          </div>
          <div className="bm-boundary">
            <MapPin size={20} />
            <strong>No live location tracking</strong>
            <p>Location for matching is derived from ride state or SOS trigger. It is never tracked or stored publicly.</p>
          </div>
          <div className="bm-boundary">
            <Users size={20} />
            <strong>No donor dispatch</strong>
            <p>Blood Mesh sends requests to nearby riders who have consented. It does not guarantee response or availability.</p>
          </div>
          <div className="bm-boundary">
            <Heart size={20} />
            <strong>Emergency only</strong>
            <p>Blood requests are critical-moment only. They never become a daily or routine feature of the platform.</p>
          </div>
        </div>
      </section>

      <section className="bm-section bm-section--faq">
        <span className="bm-label">FAQ</span>
        <h2>Clear answers before you decide.</h2>
        {faqItems.map(([q, a], i) => (
          <div className="bm-faq" key={q}>
            <button aria-expanded={expanded === i} onClick={() => setExpanded(expanded === i ? null : i)}>
              {q}
              <span>{expanded === i ? '−' : '+'}</span>
            </button>
            {expanded === i && <p>{a}</p>}
          </div>
        ))}
      </section>

      <section className="bm-section bm-section--connect">
        <h2>Next steps in BBBT.</h2>
        <div className="bm-connect-links">
          <Link href="/sos" className="bm-link-card">
            <strong>SOS & Emergency</strong>
            <span>When readiness becomes critical</span>
            <ArrowRight size={18} />
          </Link>
          <Link href="/corridor" className="bm-link-card">
            <strong>Navigation</strong>
            <span>Route preview and waypoints</span>
            <ArrowRight size={18} />
          </Link>
          <Link href="/weather" className="bm-link-card">
            <strong>Weather</strong>
            <span>Live forecast for your corridor</span>
            <ArrowRight size={18} />
          </Link>
          <Link href="/assistant" className="bm-link-card">
            <strong>Voice Assistant</strong>
            <span>Ask before you act</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="bm-footer">
        <h2>Ready to join the network?</h2>
        <p>Blood Mesh works only with explicit consent. Every rider controls their own participation.</p>
        <div className="bm-actions">
          <Link className="bm-button bm-button--primary" href="/signup?role=Rider">JOIN BBBT <ArrowRight size={16} /></Link>
          <Link className="bm-button" href="/contact">CONNECT WITH BBBT</Link>
        </div>
      </footer>
    </main>
  )
}
