'use client'

/**
 * BBBT Black Crystal Interface — reusable design-system primitives.
 * Presentational + lightweight interactive components. All visuals come from
 * app/design-system/crystal.css (namespaced under `.bcx`). Nothing here is
 * wired to any existing page; adoption happens in later, controlled phases.
 */

import {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ---------- shared semantic types ---------- */
export type Signal = 'red' | 'orange' | 'blue' | 'green' | 'white'
const signalClass: Record<Signal, string> = {
  red: 'bcx-c-red',
  orange: 'bcx-c-orange',
  blue: 'bcx-c-blue',
  green: 'bcx-c-green',
  white: 'bcx-c-white',
}

/* ============================================================ BUTTON */
type ButtonVariant = 'primary' | 'secondary' | 'tech' | 'verified' | 'highway' | 'emergency'
export function CrystalButton({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...rest
}: {
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn('bcx-btn', `bcx-btn--${variant}`, size !== 'md' && `bcx-btn--${size}`, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="bcx-btn__spinner" aria-hidden="true" />}
      {!loading && variant === 'emergency' && <span className="bcx-btn__dot" aria-hidden="true" />}
      {!loading && icon}
      {children}
    </button>
  )
}

/* ============================================================ TABS */
export function CrystalTabs({
  tabs,
  value,
  onValueChange,
  accent = 'blue',
}: {
  tabs: { id: string; label: string; icon?: ReactNode }[]
  value: string
  onValueChange: (id: string) => void
  accent?: Signal
}) {
  return (
    <div className="bcx-tabs" role="tablist" style={{ ['--bcx-accent' as string]: `var(--bcx-${accent})` }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          className="bcx-tab"
          onClick={() => onValueChange(t.id)}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* ============================================================ SEGMENTED */
export function SegmentedControl({
  options,
  value,
  onValueChange,
  accent = 'green',
}: {
  options: { id: string; label: string }[]
  value: string
  onValueChange: (id: string) => void
  accent?: Signal
}) {
  return (
    <div className="bcx-seg" role="group" style={{ ['--bcx-accent' as string]: `var(--bcx-${accent})` }}>
      {options.map((o) => (
        <button key={o.id} aria-pressed={value === o.id} onClick={() => onValueChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

/* ============================================================ TOGGLE */
export function CrystalToggle({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean
  onCheckedChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="bcx-toggle"
      onClick={() => onCheckedChange(!checked)}
    />
  )
}

/* ============================================================ CARDS */
export function CrystalCard({
  depth = 'l2',
  interactive = false,
  accent = 'blue',
  className,
  children,
  ...rest
}: {
  depth?: 'l1' | 'l2' | 'l3'
  interactive?: boolean
  accent?: Signal
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bcx-card', `bcx-card--${depth}`, interactive && 'bcx-card--interactive', className)}
      style={{ ['--bcx-accent' as string]: `var(--bcx-${accent})` }}
      tabIndex={interactive ? 0 : undefined}
      {...rest}
    >
      {children}
    </div>
  )
}

export function FeatureCard({
  icon,
  title,
  children,
  accent = 'blue',
  depth = 'l2',
}: {
  icon: ReactNode
  title: string
  children: ReactNode
  accent?: Signal
  depth?: 'l1' | 'l2' | 'l3'
}) {
  return (
    <CrystalCard depth={depth} accent={accent}>
      <span className="bcx-card__icon">{icon}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </CrystalCard>
  )
}

export function DataCard({
  label,
  value,
  trend,
  accent = 'green',
}: {
  label: string
  value: string
  trend?: string
  accent?: Signal
}) {
  return (
    <CrystalCard depth="l1" className="bcx-data-card">
      <span className="bcx-eyebrow">{label}</span>
      <strong>{value}</strong>
      {trend && <span className={cn('bcx-trend', signalClass[accent])} style={{ color: `var(--bcx-${accent})` }}>{trend}</span>}
    </CrystalCard>
  )
}

/* ============================================================ FIELDS */
type FieldState = 'default' | 'error' | 'success' | 'warning' | 'info'
export function Field({
  label,
  help,
  message,
  state = 'default',
  children,
}: {
  label: string
  help?: string
  message?: string
  state?: FieldState
  children: (id: string) => ReactNode
}) {
  const id = useId()
  const msgClass =
    state === 'error' ? 'bcx-msg--error'
      : state === 'success' ? 'bcx-msg--success'
        : state === 'warning' ? 'bcx-msg--warning'
          : 'bcx-msg--info'
  return (
    <div className="bcx-field" data-state={state}>
      <label className="bcx-label" htmlFor={id}>{label}</label>
      {children(id)}
      {help && !message && <span className="bcx-help">{help}</span>}
      {message && <span className={cn('bcx-msg', msgClass)}>{message}</span>}
    </div>
  )
}

export function CrystalInput({ id, className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input id={id} className={cn('bcx-input', className)} {...rest} />
}
export function CrystalTextarea({ id, className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea id={id} className={cn('bcx-textarea', className)} {...rest} />
}
export function CrystalSelect({ id, className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select id={id} className={cn('bcx-select', className)} {...rest}>{children}</select>
}
export function CrystalSearch({ id, className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="bcx-inputwrap">
      <Search size={16} aria-hidden="true" />
      <input id={id} type="search" className={cn('bcx-input', className)} {...rest} />
    </div>
  )
}
export function CrystalCheck({
  type = 'checkbox',
  label,
  ...rest
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="bcx-check">
      <input type={type} {...rest} />
      {label}
    </label>
  )
}

/* ============================================================ BADGES + DOTS */
export type BadgeStatus =
  | 'verified' | 'pending' | 'approved' | 'rejected' | 'active' | 'inactive'
  | 'suspended' | 'emergency' | 'warning' | 'information' | 'success'
const badgeSignal: Record<BadgeStatus, Signal> = {
  verified: 'green', approved: 'green', active: 'green', success: 'green',
  pending: 'orange', warning: 'orange', suspended: 'orange',
  emergency: 'red', rejected: 'red',
  information: 'blue', inactive: 'white',
}
export function CrystalBadge({ status, children }: { status: BadgeStatus; children?: ReactNode }) {
  return (
    <span className={cn('bcx-badge', signalClass[badgeSignal[status]])} role="status">
      {children ?? status}
    </span>
  )
}
export function StatusDot({ signal = 'green', children }: { signal?: Signal; children: ReactNode }) {
  return <span className={cn('bcx-dot', signalClass[signal])} role="status">{children}</span>
}

/* ============================================================ ALERTS + TOAST */
type Tone = 'info' | 'warning' | 'emergency' | 'success'
const toneSignal: Record<Tone, Signal> = { info: 'blue', warning: 'orange', emergency: 'red', success: 'green' }
export function CrystalAlert({ tone = 'info', icon, title, children }: { tone?: Tone; icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className={cn('bcx-alert', signalClass[toneSignal[tone]])} role={tone === 'emergency' ? 'alert' : 'status'}>
      {icon && <span className="bcx-alert__icon">{icon}</span>}
      <div>
        <h4>{title}</h4>
        {children && <p>{children}</p>}
      </div>
    </div>
  )
}
export function CrystalToast({ tone = 'info', icon, title, children, onClose }: { tone?: Tone; icon?: ReactNode; title: string; children?: ReactNode; onClose?: () => void }) {
  return (
    <div className={cn('bcx-toast', signalClass[toneSignal[tone]])} role="status">
      {icon && <span className="bcx-toast__icon">{icon}</span>}
      <div style={{ flex: 1 }}>
        <h4>{title}</h4>
        {children && <p>{children}</p>}
      </div>
      {onClose && (
        <button className="bcx-iconbtn" onClick={onClose} aria-label="Dismiss notification">
          <X size={15} />
        </button>
      )}
    </div>
  )
}

/* ============================================================ MODAL */
function useDismiss(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
}
function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return createPortal(<div className="bcx">{children}</div>, document.body)
}
export function CrystalModal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(open, onClose)
  useEffect(() => { if (open) ref.current?.focus() }, [open])
  if (!open) return null
  return (
    <Portal>
      <div className="bcx-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <div className="bcx-modal" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
          <div className="bcx-modal__head">
            <h3 className="bcx-h2">{title}</h3>
            <button className="bcx-iconbtn" onClick={onClose} aria-label="Close dialog"><X size={16} /></button>
          </div>
          <div className="bcx-body">{children}</div>
          {footer && <div className="bcx-row" style={{ marginTop: 'var(--bcx-s5)', justifyContent: 'flex-end' }}>{footer}</div>}
        </div>
      </div>
    </Portal>
  )
}

/* ============================================================ DRAWER */
export function CrystalDrawer({ open, onClose, side = 'right', title, children }: { open: boolean; onClose: () => void; side?: 'right' | 'bottom'; title: string; children: ReactNode }) {
  useDismiss(open, onClose)
  if (!open) return null
  return (
    <Portal>
      <div className="bcx-overlay" style={{ placeItems: 'stretch' }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <div className={cn('bcx-drawer', `bcx-drawer--${side}`)} role="dialog" aria-modal="true" aria-label={title}>
          <div className="bcx-modal__head">
            <h3 className="bcx-h2">{title}</h3>
            <button className="bcx-iconbtn" onClick={onClose} aria-label="Close panel"><X size={16} /></button>
          </div>
          <div className="bcx-body">{children}</div>
        </div>
      </div>
    </Portal>
  )
}

/* ============================================================ TOOLTIP */
export function CrystalTooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="bcx-tooltip" tabIndex={0}>
      {children}
      <span className="bcx-tooltip__bubble" role="tooltip">{label}</span>
    </span>
  )
}

/* ============================================================ PROGRESS */
export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="bcx-progress" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? 'Progress'}>
      <span style={{ width: `${v}%` }} />
    </div>
  )
}
export function ProgressRing({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="bcx-ring" style={{ ['--v' as string]: v }} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <span>{v}%</span>
    </div>
  )
}
export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="bcx-steps">
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          <span className={cn('bcx-step', i < current && 'bcx-step--done', i === current && 'bcx-step--active')}>
            <span className="bcx-step__dot">{i < current ? '✓' : i + 1}</span>
            {s}
          </span>
          {i < steps.length - 1 && <span className="bcx-step__bar" />}
        </div>
      ))}
    </div>
  )
}

/* ============================================================ BREADCRUMBS */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="bcx-crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={it.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          {it.href && i < items.length - 1 ? <a href={it.href}>{it.label}</a> : <span aria-current="page">{it.label}</span>}
          {i < items.length - 1 && <span aria-hidden="true">/</span>}
        </span>
      ))}
    </nav>
  )
}

/* ============================================================ NETWORK NODE */
type NodeState = 'default' | 'verified' | 'warning' | 'emergency' | 'active'
const nodeSignal: Record<NodeState, Signal> = { default: 'blue', verified: 'green', warning: 'orange', emergency: 'red', active: 'white' }
export function NetworkNode({ icon, label, state = 'default' }: { icon: ReactNode; label: string; state?: NodeState }) {
  return (
    <button className={cn('bcx-node', signalClass[nodeSignal[state]])} aria-label={`${label} (${state})`}>
      <span className="bcx-node__core">{icon}</span>
      <span>{label}</span>
    </button>
  )
}
