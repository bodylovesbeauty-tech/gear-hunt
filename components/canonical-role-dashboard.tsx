'use client'

import { useEffect, useState } from 'react'
import { identityKey, sessionKey, type PrototypeIdentity, type Role, type Status } from '@/lib/prototype-session'

export function CanonicalRoleDashboard({ role }: { role: Exclude<Role, 'Rider' | 'Group Admin' | 'Marshal' | 'Founding Rider Council Member'> }) {
  const [identity, setIdentity] = useState<PrototypeIdentity | null>(null)
  const [status, setStatus] = useState<Status>('Pending')

  useEffect(() => {
    try {
      const savedIdentity = sessionStorage.getItem(identityKey)
      const savedSession = sessionStorage.getItem(sessionKey)
      if (savedIdentity) {
        const parsed = JSON.parse(savedIdentity) as PrototypeIdentity
        setIdentity(parsed)
        setStatus(parsed.status)
      } else if (savedSession) {
        const parsed = JSON.parse(savedSession) as { status?: Status }
        if (parsed.status) setStatus(parsed.status)
      }
    } catch {}
  }, [])

  const label = role === 'Group Marshal' ? 'Group Marshal' : role === 'Independent Marshal' ? 'Independent Marshal' : 'Investor'
  const eyebrow = role === 'Investor' ? 'BBBT INVESTOR WORKSPACE' : 'BBBT MARSHAL WORKSPACE'

  return <main className="role-dashboard-shell">
    <header className="role-dashboard-header">
      <div><span className="eyebrow cyan-text">{eyebrow}</span><h1>{label} Dashboard</h1><p>Prototype workspace for the submitted BBBT identity. No unapproved operational controls are shown.</p></div>
      <span className="role-dashboard-status">{status.toUpperCase()} / PROTOTYPE</span>
    </header>
    <section className="role-dashboard-card">
      <span className="eyebrow">CURRENT IDENTITY</span>
      <h2>{identity?.fullName || 'No active prototype identity'}</h2>
      <p>{identity ? `${identity.handle} · ${identity.requestedRole}` : 'Submit this role application, then return through prototype login to load the identity.'}</p>
    </section>
    <section className="role-dashboard-card">
      <span className="eyebrow">AVAILABLE NOW</span>
      <h2>{role === 'Investor' ? 'Investor onboarding review' : 'Role onboarding review'}</h2>
      <p>{role === 'Investor' ? 'Investor-specific product and diligence requirements are pending product decision.' : 'Role-specific operational requirements are pending product decision.'}</p>
      <div className="role-dashboard-empty">No additional modules are enabled in this prototype.</div>
    </section>
  </main>
}
