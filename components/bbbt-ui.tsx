import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Status = 'verified' | 'pending' | 'approved' | 'rejected' | 'active' | 'inactive' | 'suspended' | 'emergency' | 'warning' | 'information' | 'success'

const statusClass: Record<Status, string> = {
  verified: 'status-verified', approved: 'status-approved', active: 'status-active', success: 'status-success',
  pending: 'status-pending', warning: 'status-warning', emergency: 'status-emergency',
  rejected: 'status-rejected', inactive: 'status-inactive', suspended: 'status-suspended', information: 'status-information',
}

export function BrandMark({ label = 'BBBT' }: { label?: string }) {
  return <span className="bbbt-mark" aria-hidden="true">{label}</span>
}

export function StatusBadge({ status, children }: { status: Status; children?: ReactNode }) {
  return <span className={cn('status-badge', statusClass[status])} role="status">{children ?? status}</span>
}

export function MetricCard({ label, value, detail, status = 'information' }: { label: string; value: string; detail?: string; status?: Status }) {
  return <article className="metric-card"><div className="metric-card-head"><span>{label}</span><StatusBadge status={status} /></div><strong>{value}</strong>{detail && <small>{detail}</small>}</article>
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <span className="section-label">{children}</span>
}

export function InformationCard({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <section className="information-card"><div className="information-card-head"><h3>{title}</h3>{action}</div>{children}</section>
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="empty-state"><strong>{title}</strong><p>{description}</p></div>
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <fieldset className="form-section"><legend>{title}</legend>{description && <p>{description}</p>}{children}</fieldset>
}

export type { Status }
