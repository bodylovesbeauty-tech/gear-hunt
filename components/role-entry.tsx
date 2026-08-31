'use client'

import Link from 'next/link'
import { useState } from 'react'

const roles = [
  { id: 'rider', title: 'Rider', subtitle: 'Safety network member', description: 'Join the verified rider network, set your safety preferences, and access SOS, Blood Mesh, and route support.', href: '/rider-signup', action: 'Join as rider' },
  { id: 'marshal', title: 'Marshal', subtitle: 'Local response leader', description: 'Coordinate trusted riders and help the network respond responsibly when support is needed.', href: '/roles/marshal', action: 'Explore marshal role' },
  { id: 'group-admin', title: 'Group Admin', subtitle: 'Community coordinator', description: 'Bring your riding group into the Trust Protocol with clear responsibilities and verified access.', href: '/roles/group-admin', action: 'Explore group admin' },
  { id: 'council', title: 'Founding Council', subtitle: 'Trust and governance', description: 'Help shape standards, accountability, and the long-term direction of the ecosystem.', href: '/roles/council', action: 'Explore council role' },
  { id: 'investor', title: 'Investor', subtitle: 'Mission-aligned partner', description: 'Request access to the private intelligence room and review the model when approved.', href: '/investor', action: 'Request investor access' },
]

export function RoleEntry() {
  const [language, setLanguage] = useState('English')
  const [active, setActive] = useState('rider')
  const selected = roles.find((role) => role.id === active) ?? roles[0]
  return <section className="role-entry" id="join"><div className="section-label">Choose your responsibility</div><h2 className="role-entry-title">One network. Different responsibilities.</h2><p className="role-entry-intro">BBBT is designed around accountable participation—not a generic sign-up. Choose the role that matches how you want to contribute.</p><div className="language-row"><label htmlFor="entry-language">Interface language</label><select id="entry-language" value={language} onChange={(event) => setLanguage(event.target.value)}><option>English</option><option>Hindi</option><option>Marathi</option><option>Bengali</option></select><span>Core onboarding remains available in English; your voice assistant preferences can include regional languages.</span></div><div className="role-grid">{roles.map((role) => <button type="button" className={`role-card ${active === role.id ? 'is-active' : ''}`} key={role.id} onClick={() => setActive(role.id)}><span className="role-card-kicker">{role.subtitle}</span><strong>{role.title}</strong><span>{role.description}</span></button>)}</div><div className="role-selection"><div><span className="section-label">Selected pathway</span><h3>{selected.title}</h3><p>{selected.description}</p></div><Link className="btn btn-red" href={selected.href}>{selected.action}</Link></div></section>
}

export function ResponsibilityNotice() { return <div className="responsibility-notice"><strong>Participation is a responsibility.</strong><span>By continuing, you acknowledge that BBBT is a coordination and safety-support network. It is not a replacement for emergency services, medical care, or responsible riding.</span></div> }

export function ResearchContribution() { const [range, setRange] = useState('Prefer not to say'); return <fieldset className="research-contribution"><legend>Annual safety planning</legend><p>This optional research question helps us design an affordable ecosystem. It is not a payment request, subscription, or commitment.</p><label htmlFor="annual-contribution">What could you reasonably plan to spend per year on your own rider safety?</label><select id="annual-contribution" value={range} onChange={(event) => setRange(event.target.value)}><option>Prefer not to say</option><option>₹0–₹1,000</option><option>₹1,001–₹3,000</option><option>₹3,001–₹6,000</option><option>₹6,001–₹12,000</option><option>More than ₹12,000</option></select></fieldset> }

export const roleData = roles

export default RoleEntry
