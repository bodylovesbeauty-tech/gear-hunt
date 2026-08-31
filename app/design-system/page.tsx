'use client'

import { useState } from 'react'
import {
  ShieldCheck, Siren, Network, Wrench, Route, MapPin, BadgeCheck, Landmark,
  Bike, Info, TriangleAlert, CircleCheck, Cpu, GraduationCap, Users, Plus, Minus, Layers, List, Map as MapIcon, Navigation,
} from 'lucide-react'
import {
  CrystalButton, CrystalTabs, SegmentedControl, CrystalToggle,
  CrystalCard, FeatureCard, DataCard,
  Field, CrystalInput, CrystalTextarea, CrystalSelect, CrystalSearch, CrystalCheck,
  CrystalBadge, StatusDot, CrystalAlert, CrystalToast,
  CrystalModal, CrystalDrawer, CrystalTooltip,
  ProgressBar, ProgressRing, StepIndicator, Breadcrumbs, NetworkNode,
  type BadgeStatus,
} from '@/components/ui/crystal'

function Section({ id, title, note, children }: { id: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="bcx-section" id={id} aria-label={title}>
      <header>
        <span className="bcx-eyebrow">{id}</span>
        <h2 className="bcx-h2" style={{ marginTop: 8 }}>{title}</h2>
        {note && <p className="bcx-small" style={{ marginTop: 8 }}>{note}</p>}
      </header>
      {children}
    </section>
  )
}

const swatches = [
  ['Environment', 'var(--bcx-env)', '#0b0d0e'],
  ['Graphite', 'var(--bcx-graphite)', '#12181a'],
  ['Emergency', 'var(--bcx-red)', '#ff4d40'],
  ['Highway', 'var(--bcx-orange)', '#e79a3f'],
  ['Technology', 'var(--bcx-blue)', '#5cc6e8'],
  ['Verified', 'var(--bcx-green)', '#5fd08a'],
  ['Clarity', 'var(--bcx-white)', '#f4f6f4'],
]
const badges: BadgeStatus[] = ['verified', 'pending', 'approved', 'rejected', 'active', 'inactive', 'suspended', 'emergency', 'warning', 'information', 'success']

export default function DesignSystemPage() {
  const [tab, setTab] = useState('riders')
  const [seg, setSeg] = useState('map')
  const [on, setOn] = useState(true)
  const [modal, setModal] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [toast, setToast] = useState(true)

  return (
    <main className="bcx-lab">
      <div className="bcx-lab__inner">
        <header>
          <span className="bcx-eyebrow">BBBT · Internal Component Lab</span>
          <h1 className="bcx-display" style={{ marginTop: 12 }}>Black Crystal Interface</h1>
          <p className="bcx-body" style={{ maxWidth: '46ch', marginTop: 12 }}>
            One coherent visual language for the BBBT ecosystem. Black is the environment,
            crystal is the interface, colour is the signal. Design system only — not applied to live pages yet.
          </p>
        </header>

        <Section id="01" title="Colour signals" note="Semantic colour appears as edge, indicator or glow — never as a full painted surface.">
          <div className="bcx-grid">
            {swatches.map(([name, v, hex]) => (
              <div key={name} className="bcx-swatch" style={{ background: v }}>
                <small style={{ color: name === 'Clarity' || name === 'Highway' || name === 'Technology' || name === 'Verified' ? '#08090a' : undefined }}>{name}</small>
                <span style={{ color: name === 'Clarity' || name === 'Highway' || name === 'Technology' || name === 'Verified' ? 'rgba(8,9,10,.7)' : undefined }}>{hex}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="02" title="Buttons" note="Primary, secondary, and four semantic accents. Hover / focus / active / disabled / loading states.">
          <div className="bcx-row">
            <CrystalButton variant="primary">Join BBBT</CrystalButton>
            <CrystalButton variant="secondary">Explore ecosystem</CrystalButton>
            <CrystalButton variant="tech" icon={<Cpu size={16} />}>Technology</CrystalButton>
            <CrystalButton variant="verified" icon={<BadgeCheck size={16} />}>Verified</CrystalButton>
            <CrystalButton variant="highway" icon={<Route size={16} />}>Highway</CrystalButton>
            <CrystalButton variant="emergency">SOS Emergency</CrystalButton>
          </div>
          <div className="bcx-row" style={{ marginTop: 16 }}>
            <CrystalButton variant="primary" size="sm">Small</CrystalButton>
            <CrystalButton variant="primary" size="lg">Large</CrystalButton>
            <CrystalButton variant="secondary" loading>Loading</CrystalButton>
            <CrystalButton variant="secondary" disabled>Disabled</CrystalButton>
          </div>
        </Section>

        <Section id="03" title="Tabs, segments & toggle" note="Connected crystal controls with a restrained active accent.">
          <div className="bcx-row" style={{ gap: 24 }}>
            <CrystalTabs
              value={tab}
              onValueChange={setTab}
              tabs={[
                { id: 'riders', label: 'Riders' }, { id: 'safety', label: 'Safety' }, { id: 'network', label: 'Network' },
                { id: 'community', label: 'Community' }, { id: 'council', label: 'Council' }, { id: 'investor', label: 'Investor' },
              ]}
            />
          </div>
          <div className="bcx-row" style={{ marginTop: 16, gap: 24 }}>
            <SegmentedControl value={seg} onValueChange={setSeg} options={[{ id: 'map', label: 'Map' }, { id: 'list', label: 'List' }]} />
            <CrystalToggle checked={on} onCheckedChange={setOn} label="Toggle demo" />
            <StatusDot signal={on ? 'green' : 'white'}>{on ? 'ACTIVE' : 'INACTIVE'}</StatusDot>
          </div>
        </Section>

        <Section id="04" title="Cards" note="Three depth levels and role variants. Depth is used intentionally, not everywhere.">
          <div className="bcx-grid">
            <FeatureCard icon={<ShieldCheck size={20} />} title="Safety Identity" accent="green" depth="l1">Level 1 — flat graphite for lower-priority information.</FeatureCard>
            <FeatureCard icon={<Network size={20} />} title="Rider Network" accent="blue" depth="l2">Level 2 — dark crystal for primary interaction surfaces.</FeatureCard>
            <FeatureCard icon={<Siren size={20} />} title="Emergency Mesh" accent="red" depth="l3">Level 3 — featured crystal with a semantic accent edge.</FeatureCard>
          </div>
          <div className="bcx-grid" style={{ marginTop: 16 }}>
            <DataCard label="Verified riders" value="12,480" trend="▲ 4.2% this week" accent="green" />
            <DataCard label="Active corridors" value="38" trend="● live" accent="blue" />
            <DataCard label="SOS drills" value="126" trend="▲ steady" accent="orange" />
          </div>
        </Section>

        <Section id="05" title="Forms & inputs" note="Crystal fields with clear labels, helper text, and semantic validation states.">
          <div className="bcx-grid">
            <Field label="Full name" help="As printed on your licence.">{(id) => <CrystalInput id={id} placeholder="e.g. Aditya Rao" />}</Field>
            <Field label="Mobile" state="error" message="Enter a valid 10-digit number.">{(id) => <CrystalInput id={id} inputMode="numeric" defaultValue="98765" />}</Field>
            <Field label="Blood group" state="success" message="Verified">{(id) => <CrystalSelect id={id} defaultValue="O+"><option>O+</option><option>A+</option><option>B+</option><option>AB+</option></CrystalSelect>}</Field>
            <Field label="Search riders">{(id) => <CrystalSearch id={id} placeholder="Search by name or city" />}</Field>
          </div>
          <div className="bcx-row" style={{ marginTop: 16 }}>
            <Field label="Notes">{(id) => <CrystalTextarea id={id} placeholder="Add context for the marshal team…" />}</Field>
          </div>
          <div className="bcx-row" style={{ marginTop: 16, gap: 24 }}>
            <CrystalCheck label="I agree to the safety charter" defaultChecked />
            <CrystalCheck type="radio" name="plan" label="Rider" defaultChecked />
            <CrystalCheck type="radio" name="plan" label="Marshal" />
          </div>
        </Section>

        <Section id="06" title="Badges & status" note="Eleven semantic states. Colour is sparing and always paired with a label.">
          <div className="bcx-row">
            {badges.map((b) => <CrystalBadge key={b} status={b} />)}
          </div>
          <div className="bcx-row" style={{ marginTop: 16, gap: 24 }}>
            <StatusDot signal="green">VERIFIED</StatusDot>
            <StatusDot signal="orange">PENDING</StatusDot>
            <StatusDot signal="red">EMERGENCY</StatusDot>
            <StatusDot signal="blue">INFORMATION</StatusDot>
          </div>
        </Section>

        <Section id="07" title="Alerts & notifications" note="Dark crystal base with a semantic left indicator. Emergency is controlled, never flashing.">
          <div className="bcx-grid">
            <CrystalAlert tone="info" icon={<Info size={18} />} title="Prototype environment">This is a design-system preview, not live rider data.</CrystalAlert>
            <CrystalAlert tone="success" icon={<CircleCheck size={18} />} title="Profile verified">Safety identity approved by a regional marshal.</CrystalAlert>
            <CrystalAlert tone="warning" icon={<TriangleAlert size={18} />} title="Corridor caution">Weather advisory active on NH-48 near Panvel.</CrystalAlert>
            <CrystalAlert tone="emergency" icon={<Siren size={18} />} title="SOS raised">A rider in your zone triggered an emergency beacon.</CrystalAlert>
          </div>
          {toast && (
            <div className="bcx-row" style={{ marginTop: 16 }}>
              <CrystalToast tone="success" icon={<CircleCheck size={18} />} title="Saved" onClose={() => setToast(false)}>Your changes were stored.</CrystalToast>
            </div>
          )}
        </Section>

        <Section id="08" title="Overlays" note="Crystal modal and drawer with backdrop, focus handling, Escape-to-close, and mobile-friendly sizing.">
          <div className="bcx-row">
            <CrystalButton variant="primary" onClick={() => setModal(true)}>Open modal</CrystalButton>
            <CrystalButton variant="secondary" onClick={() => setDrawer(true)}>Open drawer</CrystalButton>
            <CrystalTooltip label="Riders verified by a regional marshal">
              <CrystalButton variant="tech" icon={<Info size={16} />}>Hover tooltip</CrystalButton>
            </CrystalTooltip>
          </div>
          <CrystalModal
            open={modal}
            onClose={() => setModal(false)}
            title="Confirm action"
            footer={<><CrystalButton variant="secondary" onClick={() => setModal(false)}>Cancel</CrystalButton><CrystalButton variant="primary" onClick={() => setModal(false)}>Confirm</CrystalButton></>}
          >
            Crystal modals use a dark translucent surface, a clear hierarchy, and an accessible close control.
          </CrystalModal>
          <CrystalDrawer open={drawer} onClose={() => setDrawer(false)} title="Trust Protocol detail">
            Drawers are ideal for Care Pit details, Trust Protocol layers, profiles, and filters in later phases.
          </CrystalDrawer>
        </Section>

        <Section id="09" title="Progress & steps" note="Signup, training and profile-completion primitives — defined here, not yet applied.">
          <div className="bcx-row" style={{ gap: 32, alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 240 }}><ProgressBar value={68} label="Profile completion" /></div>
            <ProgressRing value={45} />
          </div>
          <div className="bcx-row" style={{ marginTop: 24 }}>
            <StepIndicator steps={['Account', 'Bike', 'Safety', 'Verify']} current={2} />
          </div>
          <div className="bcx-row" style={{ marginTop: 24 }}>
            <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Network', href: '#' }, { label: 'Care Pit' }]} />
          </div>
        </Section>

        <Section id="10" title="Network nodes & map controls" note="Reusable for Trust Protocol, Care Pit, and rider-network concepts. No real map built.">
          <div className="bcx-row">
            <NetworkNode icon={<Siren size={18} />} label="SOS" state="emergency" />
            <NetworkNode icon={<ShieldCheck size={18} />} label="Verified" state="verified" />
            <NetworkNode icon={<Route size={18} />} label="Corridor" state="warning" />
            <NetworkNode icon={<Network size={18} />} label="Network" state="default" />
            <NetworkNode icon={<Landmark size={18} />} label="Council" state="active" />
          </div>
          <div className="bcx-row" style={{ marginTop: 20, gap: 24 }}>
            <div className="bcx-mapctl" role="group" aria-label="Map controls">
              <button aria-label="Zoom in"><Plus size={16} /></button>
              <button aria-label="Zoom out"><Minus size={16} /></button>
              <button aria-label="My location"><Navigation size={16} /></button>
              <button aria-label="Layers"><Layers size={16} /></button>
            </div>
            <SegmentedControl value={seg} onValueChange={setSeg} accent="blue" options={[{ id: 'map', label: 'Map' }, { id: 'list', label: 'List' }]} />
            <div className="bcx-row" style={{ gap: 12 }}>
              <MapIcon size={16} aria-hidden="true" /><List size={16} aria-hidden="true" />
            </div>
          </div>
        </Section>

        <Section id="11" title="Semantic icons" note="One coherent industrial icon family (lucide) with consistent sizing.">
          <div className="bcx-row" style={{ gap: 20, color: 'var(--bcx-ink-soft)' }}>
            {[Siren, ShieldCheck, Network, MapPin, Route, Wrench, GraduationCap, Landmark, Users, Bike, BadgeCheck, Cpu].map((Icon, i) => (
              <Icon key={i} size={22} aria-hidden="true" />
            ))}
          </div>
        </Section>

        <Section id="12" title="Data table" note="Dark graphite with crystal hover rows and semantic status. No glossy glass table.">
          <table className="bcx-table">
            <thead><tr><th>Rider</th><th>Zone</th><th>Bike</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Aditya Rao</td><td>West · Mumbai</td><td>Classic 350</td><td><CrystalBadge status="verified" /></td></tr>
              <tr><td>Neha Kulkarni</td><td>South · Pune</td><td>Meteor 350</td><td><CrystalBadge status="pending" /></td></tr>
              <tr><td>Imran Shaikh</td><td>West · Panvel</td><td>Hunter 350</td><td><CrystalBadge status="emergency" /></td></tr>
            </tbody>
          </table>
        </Section>

        <footer style={{ paddingTop: 24, borderTop: '1px solid var(--bcx-line)', color: 'var(--bcx-ink-mute)', fontSize: '0.78rem' }}>
          BBBT Black Crystal Interface — internal design-system lab. Not linked from production navigation and excluded from search indexing.
        </footer>
      </div>
    </main>
  )
}
