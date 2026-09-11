import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export type AuthorizedUser = {
  id: string
  email?: string | null
  isAdmin: boolean
}

export async function getAuthorizedUser(): Promise<AuthorizedUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    isAdmin: user.app_metadata?.role === 'admin' || user.app_metadata?.is_admin === true,
  }
}

export async function requireAuthorizedUser() {
  const user = await getAuthorizedUser()
  if (!user) return { response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) as NextResponse, user: null }
  return { response: null, user }
}

export function actorMatches(user: AuthorizedUser, actorId: unknown) {
  return typeof actorId === 'string' && actorId === user.id
}

export function invalidPayload(message = 'Invalid request payload') {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function internalFailure() {
  return NextResponse.json({ error: 'Unable to complete request' }, { status: 500 })
}

export function publicIdentity(identity: Record<string, unknown>) {
  return {
    id: identity.id,
    application_id: identity.applicationId || identity.application_id,
    full_name: identity.fullName || identity.full_name,
    handle: identity.handle,
    requested_role: identity.requestedRole || identity.requested_role,
    status: identity.status || 'Approved',
  }
}

export function publicGroup(row: Record<string, any>, memberCount = 0) {
  return {
    targetId: row.id,
    identifier: row.share_token,
    name: row.name,
    createdAt: row.created_at,
    memberCount,
    image: row.payload?.image || null,
    description: row.description || null,
    location: row.payload?.location || null,
    status: 'ACTIVE' as const,
  }
}

export function publicMembership(row: Record<string, unknown>) {
  return {
    id: row.id,
    group_id: row.group_id,
    ride_id: row.ride_id,
    role: row.role,
    status: row.status,
    joined_at: row.joined_at,
  }
}

export function publicNetworkRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    share_token: row.share_token,
    invite_token: row.invite_token,
    description: row.description,
    route: row.route,
    date_text: row.date_text,
    group_id: row.group_id,
    creator_id: row.creator_id,
    status: row.status,
    created_at: row.created_at,
  }
}

export function publicReferral(row: Record<string, unknown>) {
  return {
    id: row.id,
    public_token: row.public_token,
    target_type: row.target_type,
    target_id: row.target_id,
    status: row.status,
    created_at: row.created_at,
  }
}

export function publicError(error: unknown) {
  console.error('[v0] Supabase route failure', error)
  return internalFailure()
}
