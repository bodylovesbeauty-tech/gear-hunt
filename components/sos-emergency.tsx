'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Cross, Droplet, Home, MapPin, Navigation, Phone, Plus, Radio, ShieldCheck, Siren, Users } from 'lucide-react'
import { dashboardFor, identityKey, sessionKey, type PrototypeIdentity, type Role } from '@/lib/prototype-session'
import './sos-emergency.css'

type Rider = { name: string; id: string; blood: string; kitActive: boolean; location: string }
type Contact = { name: string; rel: string; phone: string }

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

const DEMO_RIDER: Rider = { name: 'Arjun Mehra', id: 'BBBT-MH-04-11827', blood: 'O+', kitActive: true, location: 'Bandra West, Mumbai' }
const DEMO_CONTACTS: Contact[] = [
  { name: 'Priya Mehra', rel: 'Spouse', phone: '+91 98200 11827' },
  { name: 'Rohit Deshmukh', rel: 'Ride Buddy', phone: '+91 99870 55210' },
  { name: 'BBBT Control Room', rel: 'Zone Marshal', phone: '1800 267 2288' },
]
const DONORS = [
  { group: 'O+', name: 'Vikas P.', note: 'Last donated 4 months ago', km: '1.4 km' },
  { group: 'O+', name: 'Farhan A.', note: 'Last donated 6 months ago', km: '2.1 km' },
  { group: 'O-', name: 'Sana R.', note: 'Last donated 2 months ago', km: '3 km' },
  { group: 'O-', name: 'Imran S.', note: 'Last donated 8 months ago', km: '4.5 km' },
]
const CARE_PITS = [
  { name: 'Bandra Sea-Link Care Pit', badge: '24/7', type: 'Care Pit', tags: ['First Aid', 'Rest', 'Tools', 'Water'], km: '2.8 km' },
  { name: 'Lilavati Emergency Hospital', badge: '24/7', type: 'Hospital', tags: ['Trauma', 'Blood Bank', 'ICU'], km: '4.1 km' },
  { name: 'Worli Fuel + Aid Stop', badge: '', type: 'Fuel + Aid', tags: ['Fuel', 'First Aid', 'Air'], km: '5.6 km' },
  { name: 'Dadar Rider Mechanic Hub', badge: '', type: 'Mechanic', tags: ['Puncture', 'Chain', 'Battery'], km: '6.9 km' },
]

export function SosEmergency() {
  const [authed, setAuthed] = useState(false)
  const [role, setRole] = useState<Role>('Rider')
  const [rider, setRider] = useState<Rider>(DEMO_RIDER)
  const [contacts, setContacts] = useState<Contact[]>(DEMO_CONTACTS)
  const [tab, setTab] = useState<'sos' | 'route'>('sos')
  const [blood, setBlood] = useState('O+')
  const [pct, setPct] = useState(0)
  const [sent, setSent] = useState(false)
  const [notice, setNotice] = useState('')
  const timer = useRef<number | null>(null)
  const start = useRef(0)
  const noticeTimer = useRef<number | null>(null)

  useEffect(() => {
    try {
      const savedSession = sessionStorage.getItem(sessionKey)
      const savedIdentity = sessionStorage.getItem(identityKey)
      const session = savedSession ? (JSON.parse(savedSession) as { activeRole?: Role; user?: { approvedRoles?: Role[]; status?: string } }) : null
      const ok = Boolean(session?.user?.status === 'Approved')
      setAuthed(ok)
      const activeRole = session?.activeRole || session?.user?.approvedRoles?.[0]
      if (activeRole) setRole(activeRole)
      if (ok && savedIdentity) {
        const id = JSON.parse(savedIdentity) as PrototypeIdentity
        const group = id.bloodGroup && BLOOD_GROUPS.includes(id.bloodGroup) ? id.bloodGroup : 'O+'
        setRider({
          name: id.fullName || 'BBBT Rider',
          id: id.applicationId || 'BBBT-MEMBER',
          blood: id.bloodGroup || '—',
          kitActive: id.safetyKit?.status === 'ACTIVE',
          location: [id.city, id.state].filter(Boolean).join(', ') || 'Location not set',
        })
        setBlood(group)
        const ec = id.emergencyContacts?.length
          ? id.emergencyContacts.map((c) => ({ name: c.fullName, rel: c.relationship || 'Emergency contact', phone: c.mobile }))
          : id.emergencyName
            ? [{ name: id.emergencyName, rel: 'Emergency contact', phone: id.emergencyNumber || '' }]
            : []
        if (ec.length) setContacts(ec)
      }
    } catch {}
    return () => {
      if (timer.current) window.clearInterval(timer.current)
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current)
    }
  }, [])

  const flash = (message: string) => {
    setNotice(message)
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current)
    noticeTimer.current = window.setTimeout(() => setNotice(''), 4200)
  }

  const complete = () => {
    setSent(true)
    setPct(100)
    flash(authed ? 'SOS simulation broadcast to your emergency contacts and zone marshal. No real dispatch is connected yet.' : 'SOS simulation queued. Sign in to broadcast to your own contacts. No real dispatch is connected.')
  }

  const startHold = () => {
    if (sent) return
    start.current = Date.now()
    if (timer.current) window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      const p = Math.min(100, ((Date.now() - start.current) / 1600) * 100)
      setPct(p)
      if (p >= 100) {
        if (timer.current) window.clearInterval(timer.current)
        timer.current = null
        complete()
      }
    }, 40)
  }
  const stopHold = () => {
    if (timer.current) {
      window.clearInterval(timer.current)
      timer.current = null
    }
    if (!sent) setPct(0)
  }
  const resetSos = () => { setSent(false); setPct(0); flash('SOS simulation reset.') }

  const homeHref = authed ? dashboardFor(role) : '/'
  const homeLabel = authed ? 'Dashboard' : 'Home'

  return (
    <main className="sosx">
      <div className="sosx__inner">
        <div className="sosx-idbar">
          <div className="sosx-id">
            <span className="sosx-avatar" aria-hidden="true"><Siren size={18} /></span>
            <div>
              <b>{rider.name}</b>
              <small>{rider.id}</small>
            </div>
          </div>
          <div className="sosx-pills">
            <span className="sosx-pill sosx-pill--blood"><Droplet size={13} /> {rider.blood}</span>
            <span className={`sosx-pill ${rider.kitActive ? 'sosx-pill--kit' : 'sosx-pill--kit-off'}`}><ShieldCheck size={13} /> {rider.kitActive ? 'Kit Active' : 'Kit Not Active'}</span>
            <span className="sosx-pill"><MapPin size={13} /> {rider.location}</span>
          </div>
        </div>

        <div className="sosx-tabs">
          <div className="sosx-tabgroup" role="tablist" aria-label="SOS views">
            <button role="tab" aria-selected={tab === 'sos'} className="sosx-tab" onClick={() => setTab('sos')}><Siren size={15} /> SOS Core</button>
            <button role="tab" aria-selected={tab === 'route'} className="sosx-tab is-route" onClick={() => setTab('route')}><MapPin size={15} /> Route Corridor</button>
          </div>
          <Link className="sosx-home" href={homeHref}><Home size={15} /> {homeLabel}</Link>
        </div>

        {!authed && (
          <div className="sosx-banner">
            <strong>DEMO VIEW</strong>
            <span>Showing sample rider data. This is a safe prototype — it does not contact emergency services.</span>
            <Link href="/login?returnTo=/sos">Sign in to use your profile <ArrowRight size={13} /></Link>
          </div>
        )}

        {tab === 'sos' ? (
          <div className="sosx-grid">
            <div className="sosx-col">
              <section className="sosx-card sosx-sos">
                <span className="sosx-eyebrow">RIDER SOS</span>
                <h2>Emergency, one tap away</h2>
                <div className="sosx-dial" style={{ ['--pct' as string]: pct }}>
                  <span className="sosx-dial__ring" aria-hidden="true" />
                  <button
                    type="button"
                    className={`sosx-dial__btn ${sent ? 'sent' : ''}`}
                    onPointerDown={startHold}
                    onPointerUp={stopHold}
                    onPointerLeave={stopHold}
                    onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !sent) { e.preventDefault(); complete() } }}
                    aria-label={sent ? 'SOS signal sent, simulation' : 'Press and hold to send SOS simulation'}
                  >
                    <strong>{sent ? 'SENT' : 'SOS'}</strong>
                    <small>{sent ? 'BROADCASTING' : 'HOLD TO SEND'}</small>
                  </button>
                </div>
                <p>Press and hold for 1.6s to broadcast your location to marshals, contacts and nearby riders.</p>
                {sent && <button type="button" className="sosx-btn sosx-btn--ghost" style={{ marginTop: '1rem' }} onClick={resetSos}>Reset simulation</button>}
                <div className="sosx-stats">
                  <div className="sosx-stat"><b>{contacts.length + 1}</b><span>Responders nearby</span></div>
                  <div className="sosx-stat"><b>West Zone</b><span>Active zone</span></div>
                </div>
              </section>
            </div>

            <div className="sosx-col">
              <section className="sosx-card">
                <div className="sosx-card__head">
                  <span className="ic" aria-hidden="true"><Droplet size={17} /></span>
                  <div><b>Blood Mesh</b><span>Nearby compatible donors, live</span></div>
                </div>
                <p className="sosx-mesh-note">Required blood group</p>
                <div className="sosx-chips">
                  {BLOOD_GROUPS.map((g) => (
                    <button key={g} className="sosx-chip" aria-pressed={blood === g} onClick={() => setBlood(g)}>{g}</button>
                  ))}
                </div>
                <button type="button" className="sosx-btn" onClick={() => flash(`Searching compatible ${blood} donors within 5 km… (prototype, no personal data shared)`)}><Radio size={15} /> Request {blood} blood</button>
                <p className="sosx-mesh-note">{DONORS.length} compatible donors within 5 km</p>
                {DONORS.map((d) => (
                  <div className="sosx-donor" key={d.name}>
                    <span className="sosx-donor__g">{d.group}</span>
                    <div><b>{d.name}</b><small>{d.note}</small></div>
                    <span className="sosx-donor__km">{d.km}</span>
                  </div>
                ))}
              </section>

              <section className="sosx-card">
                <div className="sosx-card__head">
                  <span className="ic green" aria-hidden="true"><Cross size={17} /></span>
                  <div><b>Care Pit Network</b><span>Nearest safe stops and aid</span></div>
                </div>
                {CARE_PITS.map((c) => (
                  <div className="sosx-row" key={c.name}>
                    <span className="ic" aria-hidden="true"><Cross size={16} /></span>
                    <div className="sosx-row__body">
                      <b>{c.name} {c.badge && <span className="sosx-badge">{c.badge}</span>}</b>
                      <span className="sosx-type">{c.type}</span>
                      <div className="sosx-tags">{c.tags.map((t) => <span key={t}>{t}</span>)}</div>
                    </div>
                    <div className="sosx-row__end">
                      <span className="km">{c.km}</span>
                      <button type="button" className="sosx-route" onClick={() => flash(`${c.name} set as corridor stop. Navigation packet ready (prototype).`)}><Navigation size={12} /> Route</button>
                    </div>
                  </div>
                ))}
              </section>

              <section className="sosx-card">
                <div className="sosx-card__head">
                  <span className="ic green" aria-hidden="true"><Phone size={17} /></span>
                  <div><b>Emergency Contacts</b><span>Auto-alerted on SOS</span></div>
                  <div className="sosx-card__act">
                    {authed
                      ? <Link className="sosx-route" href="/dashboard/profile"><Plus size={12} /> Add</Link>
                      : <Link className="sosx-route" href="/login?returnTo=/sos"><Plus size={12} /> Add</Link>}
                  </div>
                </div>
                {contacts.length === 0 && <p className="sosx-mesh-note">No emergency contacts saved yet. Add them from your profile.</p>}
                {contacts.map((c) => (
                  <div className="sosx-row" key={c.name + c.phone}>
                    <div className="sosx-row__body">
                      <b>{c.name}</b>
                      <span className="sosx-type">{c.rel}{c.phone ? ` · ${c.phone}` : ''}</span>
                    </div>
                    {c.phone && <a className="sosx-contact__end" href={`tel:${c.phone.replace(/\s/g, '')}`} aria-label={`Call ${c.name}`}><Phone size={14} /></a>}
                  </div>
                ))}
              </section>
            </div>
          </div>
        ) : (
          <div className="sosx-corridor">
            <section className="sosx-card">
              <div className="sosx-card__head">
                <span className="ic" aria-hidden="true"><MapPin size={17} /></span>
                <div><b>Route Corridor</b><span>Safe stops and responders along your ride</span></div>
              </div>
              <p className="sosx-mesh-note">SOS stays one tap away while you ride. These stops are ordered by distance on your current corridor.</p>
              {CARE_PITS.map((c) => (
                <div className="sosx-row" key={c.name}>
                  <span className="ic" aria-hidden="true"><Cross size={16} /></span>
                  <div className="sosx-row__body">
                    <b>{c.name} {c.badge && <span className="sosx-badge">{c.badge}</span>}</b>
                    <span className="sosx-type">{c.type}</span>
                  </div>
                  <div className="sosx-row__end">
                    <span className="km">{c.km}</span>
                    <button type="button" className="sosx-route" onClick={() => flash(`${c.name} added to your corridor watch (prototype).`)}><Navigation size={12} /> Route</button>
                  </div>
                </div>
              ))}
            </section>
            <section className="sosx-card">
              <div className="sosx-card__head">
                <span className="ic blue" aria-hidden="true"><Users size={17} /></span>
                <div><b>Responders on corridor</b><span>Prototype simulation, not live tracking</span></div>
              </div>
              <div className="sosx-stats" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}>
                <div className="sosx-stat"><b>{contacts.length + 1}</b><span>Responders nearby</span></div>
                <div className="sosx-stat"><b>West Zone</b><span>Active zone</span></div>
              </div>
              <button type="button" className="sosx-btn" style={{ marginTop: '1rem' }} onClick={() => setTab('sos')}><Siren size={15} /> Back to SOS Core</button>
            </section>
          </div>
        )}

        <p className="sosx-foot">BBBT · Brand Biker Brotherhood Trust — safety infrastructure. SOS sits above every other feature.<br />Prototype / safe simulation — no real emergency dispatch or medical verification is connected. In a real emergency call 112.</p>
      </div>
      {notice && <div className="sosx-notice" role="status">{notice}</div>}
    </main>
  )
}
