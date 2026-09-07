'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Bike, CheckCircle2, Circle, Clock, Droplet, Gauge, LocateFixed, MapPin, Navigation, ShieldCheck, Siren, Users } from 'lucide-react'
import { useRiderContext } from '@/lib/use-rider-context'
import '@/components/start-ride-experience.css'

type Phase = 'ready' | 'active' | 'ended'
type Geo = { status: 'idle' | 'locating' | 'ok' | 'error'; label: string }

function useCheck(rider: ReturnType<typeof useRiderContext>) {
  return [
    { key: 'profile', label: 'Rider profile complete', ok: rider.hasProfile, detail: rider.hasProfile ? rider.name : 'Add your name and blood group' },
    { key: 'blood', label: 'Blood group on record', ok: rider.blood !== '—', detail: rider.blood !== '—' ? rider.blood : 'Not set' },
    { key: 'kit', label: 'Safety kit active', ok: rider.kitActive, detail: rider.kitActive ? 'Kit linked' : 'Activate from dashboard' },
    { key: 'contacts', label: 'Emergency contact saved', ok: rider.contacts.length > 0, detail: rider.contacts[0]?.name ?? 'None saved' },
    { key: 'vehicle', label: 'Vehicle registered', ok: Boolean(rider.vehicle), detail: rider.vehicle ?? 'Not registered' },
  ]
}

function fmt(secs: number) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

export function StartRideExperience() {
  const rider = useRiderContext()
  const checks = useCheck(rider)
  const readyCount = checks.filter((c) => c.ok).length
  const allReady = readyCount === checks.length

  const [phase, setPhase] = useState<Phase>('ready')
  const [elapsed, setElapsed] = useState(0)
  const [distance, setDistance] = useState(0)
  const [geo, setGeo] = useState<Geo>({ status: 'idle', label: 'Location not requested' })
  const [notice, setNotice] = useState('')
  const tick = useRef<number | null>(null)

  useEffect(() => () => { if (tick.current) window.clearInterval(tick.current) }, [])

  const flash = (m: string) => { setNotice(m); window.setTimeout(() => setNotice(''), 4000) }

  const locate = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeo({ status: 'error', label: 'Geolocation not supported on this device' })
      return
    }
    setGeo({ status: 'locating', label: 'Requesting your location…' })
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo({ status: 'ok', label: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }),
      () => setGeo({ status: 'error', label: 'Permission denied — start location stays manual' }),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  const startRide = () => {
    setPhase('active')
    setElapsed(0)
    setDistance(0)
    flash('Ride started. This is a local prototype — no GPS trail is recorded or shared.')
    if (tick.current) window.clearInterval(tick.current)
    tick.current = window.setInterval(() => {
      setElapsed((e) => e + 1)
      setDistance((d) => Math.round((d + 0.18 + Math.random() * 0.08) * 100) / 100)
    }, 1000)
  }

  const endRide = () => {
    if (tick.current) window.clearInterval(tick.current)
    tick.current = null
    setPhase('ended')
    flash('Ride ended. Summary is local to this prototype.')
  }

  const resetRide = () => { setPhase('ready'); setElapsed(0); setDistance(0) }

  return (
    <main className="sr-page">
      <section className="sr-console">
        <div className="sr-console__inner">
          <div className="sr-idbar">
            <div className="sr-id">
              <span className="sr-avatar" aria-hidden="true"><Bike size={18} /></span>
              <div>
                <b>{rider.name}</b>
                <small>{rider.memberId}</small>
              </div>
            </div>
            <div className="sr-pills">
              <span className="sr-pill sr-pill--blood"><Droplet size={13} /> {rider.blood}</span>
              <span className={`sr-pill ${rider.kitActive ? 'sr-pill--kit' : 'sr-pill--kit-off'}`}><ShieldCheck size={13} /> {rider.kitActive ? 'Kit Active' : 'Kit Not Active'}</span>
              <span className="sr-pill"><MapPin size={13} /> {rider.location}</span>
            </div>
          </div>

          {!rider.authed && (
            <div className="sr-banner">
              <strong>DEMO VIEW</strong>
              <span>Sample rider shown. Sign in to run the checklist against your own profile. No ride data is recorded.</span>
              <Link href="/login?returnTo=/start-ride">Sign in <ArrowRight size={13} /></Link>
            </div>
          )}

          <div className="sr-grid">
            {/* Readiness checklist */}
            <div className="sr-panel">
              <div className="sr-panel__head">
                <span className="sr-eyebrow">PRE-RIDE READINESS</span>
                <span className={`sr-readymeter ${allReady ? 'is-ok' : ''}`}>{readyCount}/{checks.length} ready</span>
              </div>
              <div className="sr-progress"><i style={{ width: `${(readyCount / checks.length) * 100}%` }} /></div>
              <ul className="sr-checklist">
                {checks.map((c) => (
                  <li key={c.key} className={c.ok ? 'is-ok' : 'is-missing'}>
                    {c.ok ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    <div>
                      <b>{c.label}</b>
                      <small>{c.detail}</small>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="sr-geo">
                <button type="button" onClick={locate} className={`sr-geo__btn ${geo.status}`}>
                  <LocateFixed size={15} /> {geo.status === 'ok' ? 'Location captured' : geo.status === 'locating' ? 'Locating…' : 'Use my start location'}
                </button>
                <span className="sr-geo__label">{geo.label}</span>
              </div>
            </div>

            {/* Ride state machine */}
            <div className="sr-panel sr-panel--ride">
              <span className="sr-eyebrow">RIDE STATE</span>
              <div className={`sr-statechip sr-statechip--${phase}`}>
                {phase === 'ready' && <>READY TO ROLL</>}
                {phase === 'active' && <>RIDE ACTIVE</>}
                {phase === 'ended' && <>RIDE COMPLETE</>}
              </div>

              <div className="sr-telemetry">
                <div className="sr-metric">
                  <Clock size={16} />
                  <b>{fmt(elapsed)}</b>
                  <span>Elapsed</span>
                </div>
                <div className="sr-metric">
                  <Gauge size={16} />
                  <b>{distance.toFixed(2)}</b>
                  <span>km (sim)</span>
                </div>
                <div className="sr-metric">
                  <Users size={16} />
                  <b>{rider.contacts.length}</b>
                  <span>Contacts on standby</span>
                </div>
              </div>

              {phase === 'ready' && (
                <>
                  {!allReady && <p className="sr-warn">You can still ride, but {checks.length - readyCount} readiness item{checks.length - readyCount > 1 ? 's are' : ' is'} incomplete.</p>}
                  <button type="button" className="sr-start" onClick={startRide}><Navigation size={16} /> Start ride</button>
                </>
              )}
              {phase === 'active' && (
                <div className="sr-active-actions">
                  <Link className="sr-sos" href="/sos"><Siren size={16} /> SOS</Link>
                  <button type="button" className="sr-end" onClick={endRide}>End ride</button>
                </div>
              )}
              {phase === 'ended' && (
                <div className="sr-summary">
                  <p><b>Ride summary (local)</b></p>
                  <div className="sr-summary__row"><span>Duration</span><b>{fmt(elapsed)}</b></div>
                  <div className="sr-summary__row"><span>Distance (sim)</span><b>{distance.toFixed(2)} km</b></div>
                  <div className="sr-summary__row"><span>Start location</span><b>{geo.status === 'ok' ? geo.label : 'Manual'}</b></div>
                  <button type="button" className="sr-start" onClick={resetRide}>Plan another ride</button>
                </div>
              )}
              <p className="sr-ride-note">SOS stays one tap away during the ride. Prototype only — no live GPS tracking, dispatch or recording.</p>
            </div>
          </div>
          <p className="sr-console__foot">Start Ride prepares you; it does not track you. Prototype / safe simulation — distance and timing are simulated locally and never leave your browser. In a real emergency call 112.</p>
        </div>
      </section>

      <section className="sr-info">
        <div className="sr-info__inner">
          <span className="sr-eyebrow">WHAT START RIDE DOES</span>
          <h2>Begin every ride with your state and safety visible.</h2>
          <div className="sr-info__grid">
            <article><ShieldCheck size={20} /><h3>Readiness first</h3><p>A quick check of profile, blood group, kit, contacts and vehicle before you roll — pulled from your account.</p></article>
            <article><Siren size={20} /><h3>SOS always attached</h3><p>Once a ride is active, SOS and your emergency contacts stay one tap away without leaving the ride view.</p></article>
            <article><Navigation size={20} /><h3>Corridor aware</h3><p>Start Ride links into the Navigation corridor and Weather so you leave prepared, not guessing.</p></article>
          </div>
          <div className="sr-connect">
            <Link href="/corridor" className="sr-link-card"><strong>Navigation</strong><span>Route corridor and waypoints</span><ArrowRight size={18} /></Link>
            <Link href="/weather" className="sr-link-card"><strong>Weather</strong><span>Go / no-go before you ride</span><ArrowRight size={18} /></Link>
            <Link href="/sos" className="sr-link-card"><strong>SOS & Emergency</strong><span>One tap during the ride</span><ArrowRight size={18} /></Link>
            <Link href="/blood-mesh" className="sr-link-card"><strong>Blood Mesh</strong><span>Consent-led critical support</span><ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {notice && <div className="sr-notice" role="status">{notice}</div>}
    </main>
  )
}
