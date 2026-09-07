'use client'

import { useEffect, useState } from 'react'
import { dashboardFor, identityKey, sessionKey, type PrototypeIdentity, type Role } from '@/lib/prototype-session'

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const

/** Whole-blood donor compatibility: recipient group -> compatible donor groups. */
export const BLOOD_COMPATIBILITY: Record<string, string[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
}

export type RiderContact = { name: string; rel: string; phone: string }

export type RiderContext = {
  ready: boolean
  authed: boolean
  role: Role
  dashboardHref: string
  name: string
  memberId: string
  handle: string
  blood: string
  kitActive: boolean
  city: string
  location: string
  contacts: RiderContact[]
  vehicle: string | null
  hasProfile: boolean
}

const DEMO: RiderContext = {
  ready: false,
  authed: false,
  role: 'Rider',
  dashboardHref: '/',
  name: 'Arjun Mehra',
  memberId: 'BBBT-MH-04-11827',
  handle: '@arjun.rides',
  blood: 'O+',
  kitActive: true,
  city: 'Mumbai',
  location: 'Bandra West, Mumbai',
  contacts: [
    { name: 'Priya Mehra', rel: 'Spouse', phone: '+91 98200 11827' },
    { name: 'Rohit Deshmukh', rel: 'Ride Buddy', phone: '+91 99870 55210' },
    { name: 'BBBT Control Room', rel: 'Zone Marshal', phone: '1800 267 2288' },
  ],
  vehicle: 'Royal Enfield Himalayan',
  hasProfile: true,
}

/**
 * Reads the prototype session + identity from sessionStorage and returns a
 * unified rider context used across every feature page. When no approved
 * session exists it returns labelled demo data so logged-out visitors still
 * see the full experience. Mirrors the logic proven in the SOS component.
 */
export function useRiderContext(): RiderContext {
  const [ctx, setCtx] = useState<RiderContext>({ ...DEMO })

  useEffect(() => {
    try {
      const savedSession = sessionStorage.getItem(sessionKey)
      const savedIdentity = sessionStorage.getItem(identityKey)
      const session = savedSession
        ? (JSON.parse(savedSession) as { activeRole?: Role; user?: { approvedRoles?: Role[]; status?: string } })
        : null
      const authed = Boolean(session?.user?.status === 'Approved')
      const role = (session?.activeRole || session?.user?.approvedRoles?.[0] || 'Rider') as Role

      if (authed && savedIdentity) {
        const id = JSON.parse(savedIdentity) as PrototypeIdentity
        const contacts: RiderContact[] = id.emergencyContacts?.length
          ? id.emergencyContacts.map((c) => ({ name: c.fullName, rel: c.relationship || 'Emergency contact', phone: c.mobile }))
          : id.emergencyName
            ? [{ name: id.emergencyName, rel: 'Emergency contact', phone: id.emergencyNumber || '' }]
            : []
        setCtx({
          ready: true,
          authed: true,
          role,
          dashboardHref: dashboardFor(role),
          name: id.fullName || 'BBBT Rider',
          memberId: id.applicationId || 'BBBT-MEMBER',
          handle: id.handle ? (id.handle.startsWith('@') ? id.handle : `@${id.handle}`) : '@bbbt.rider',
          blood: id.bloodGroup || '—',
          kitActive: id.safetyKit?.status === 'ACTIVE',
          city: id.city || 'Location not set',
          location: [id.city, id.state].filter(Boolean).join(', ') || 'Location not set',
          contacts,
          vehicle: id.vehicles?.[0] ? `${id.vehicles[0].make} ${id.vehicles[0].model}`.trim() : null,
          hasProfile: Boolean(id.fullName && id.bloodGroup),
        })
        return
      }

      setCtx({ ...DEMO, ready: true, authed: false, role, dashboardHref: '/' })
    } catch {
      setCtx({ ...DEMO, ready: true })
    }
  }, [])

  return ctx
}
