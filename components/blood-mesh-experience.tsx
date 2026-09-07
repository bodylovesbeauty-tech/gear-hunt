'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, Heart, MapPin, Radio, ShieldAlert, Users } from 'lucide-react'
import Link from 'next/link'
import '@/components/blood-mesh-experience.css'

export function BloodMeshExperience() {
  const [expanded, setExpanded] = useState<number | null>(null)
  const bloodGroups = ['O+', 'O−', 'A+', 'A−', 'B+', 'B−', 'AB+', 'AB−']
  const faqItems = [
    ['Is this hospital-grade matching?', 'No. Blood Mesh is a consent-led prototype. Never replace hospital typing with this tool.'],
    ['Are donors or hospitals connected?', 'No. This demo shows a request flow. No actual donor dispatch, hospital partnership or live matching exists.'],
    ['Will my blood type be public?', 'No. The public demo shows no personal data. Authorized Riders would record their information in private accounts.'],
    ['How does privacy work?', 'Blood group, location and consent state remain in authorized accounts only. Public visitors see no names, numbers or medical details.'],
    ['What if I refuse the request?', 'Refusal is valid at any step. Blood Mesh works only with explicit consent. No pressure, no tracking of refusal.'],
  ]

  return (
    <main className="bm-page">
      <header className="bm-hero">
        <div className="bm-hero__content">
          <span className="bm-label">BLOOD MESH / CONSENT-LED SUPPORT</span>
          <h1>A concept for critical moments.</h1>
          <p>Blood Mesh explores how riders might understand a blood-support request without exposing private medical information or claiming hospital-grade matching.</p>
          <div className="bm-actions">
            <Link className="bm-button bm-button--primary" href="/signup?role=Rider">JOIN BBBT <ArrowRight size={16} /></Link>
            <Link className="bm-button" href="#concept">VIEW CONCEPT</Link>
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

      <section className="bm-section" id="concept">
        <span className="bm-label">INTERACTIVE CONCEPT</span>
        <h2>See how Blood Mesh handles a request.</h2>
        <div className="bm-demo">
          <div className="bm-card">
            <strong>Blood Groups</strong>
            <p>Select to see compatibility options:</p>
            <div className="bm-groups">
              {bloodGroups.map((bg) => (
                <button key={bg} className="bm-group-chip" title={`Blood group ${bg}`}>
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div className="bm-card bm-card--flow">
            <strong>Request Flow</strong>
            <div className="bm-flow-demo">
              <div className="bm-step">
                <span className="bm-step-num">1</span>
                <div>
                  <b>Incident detected</b>
                  <span>Rider needs support</span>
                </div>
              </div>
              <div className="bm-arrow">↓</div>
              <div className="bm-step">
                <span className="bm-step-num">2</span>
                <div>
                  <b>Consent checked</b>
                  <span>Blood Mesh enabled?</span>
                </div>
              </div>
              <div className="bm-arrow">↓</div>
              <div className="bm-step">
                <span className="bm-step-num">3</span>
                <div>
                  <b>Nearby check</b>
                  <span>Compatible riders nearby</span>
                </div>
              </div>
              <div className="bm-arrow">↓</div>
              <div className="bm-step">
                <span className="bm-step-num">4</span>
                <div>
                  <b>Request sent</b>
                  <span>To compatible network</span>
                </div>
              </div>
              <div className="bm-arrow">↓</div>
              <div className="bm-step">
                <span className="bm-step-num">5</span>
                <div>
                  <b>Consent choice</b>
                  <span>Responders decide</span>
                </div>
              </div>
            </div>
          </div>
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
