import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { actorMatches, publicIdentity, publicError, requireAuthorizedUser } from '@/lib/supabase/authorization'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }
type IdentityPayload = { id: string; applicationId?: string; fullName?: string; handle?: string; mobile?: string; email?: string | null; requestedRole?: string; status?: string; [key: string]: JsonValue | undefined }

function identityPayload(identity: IdentityPayload) {
  return { id: identity.id, application_id: identity.applicationId || `APP-${identity.id}`, full_name: identity.fullName || identity.id, handle: identity.handle || identity.id, mobile: identity.mobile || `prototype-${identity.id}`, email: identity.email || null, requested_role: identity.requestedRole || 'Rider', status: identity.status || 'Approved', payload: identity }
}

export async function GET() {
  const auth = await requireAuthorizedUser()
  if (auth.response) return auth.response
  const supabase = createAdminClient()
  const email = auth.user.email?.trim().toLowerCase()
  const phone = auth.user.phone?.trim()
  if (!email && !phone) return NextResponse.json({ error: 'Authenticated identity is incomplete' }, { status: 404 })

  const identityQuery = email
    ? supabase.from('bbbt_identities').select('id,application_id,full_name,handle,mobile,email,requested_role,status,payload,created_at').ilike('email', email).maybeSingle()
    : supabase.from('bbbt_identities').select('id,application_id,full_name,handle,mobile,email,requested_role,status,payload,created_at').eq('mobile', phone!).maybeSingle()
  const { data, error } = await identityQuery
  if (error) return NextResponse.json({ error: 'Unable to look up identity' }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Identity not found' }, { status: 404 })
  return NextResponse.json({ identity: publicIdentity({ id: data.id, application_id: data.application_id, full_name: data.full_name, handle: data.handle, requested_role: data.requested_role, status: data.status }) })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (body.action !== 'sync-identity' || !body.identity?.id) return NextResponse.json({ error: 'Invalid identity payload' }, { status: 400 })
    const auth = await requireAuthorizedUser()
    if (auth.response) return auth.response
    if (!actorMatches(auth.user, body.identity.id)) return NextResponse.json({ error: 'Identity ownership mismatch' }, { status: 403 })
    const supabase = createAdminClient()
    const { error } = await supabase.from('bbbt_identities').upsert(identityPayload(body.identity), { onConflict: 'id' })
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error) {
    return publicError(error)
  }
}
