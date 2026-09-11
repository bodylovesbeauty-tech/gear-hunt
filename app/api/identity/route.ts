import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { actorMatches, publicIdentity, publicError, requireAuthorizedUser } from '@/lib/supabase/authorization'

function identityPayload(identity: any) {
  return { id: identity.id, application_id: identity.applicationId || `APP-${identity.id}`, full_name: identity.fullName, handle: identity.handle, mobile: identity.mobile, email: identity.email || null, requested_role: identity.requestedRole, status: identity.status || 'Approved', payload: identity }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const login = (url.searchParams.get('login') || '').trim()
  if (!login) return NextResponse.json({ error: 'Missing login' }, { status: 400 })
  const supabase = createAdminClient()
  const normalizedHandle = login.replace(/^@/, '').toLowerCase()
  const query = login.includes('@')
    ? supabase.from('bbbt_identities').select('id,application_id,full_name,handle,mobile,email,requested_role,status,payload,created_at').ilike('email', login).maybeSingle()
    : /^\+?[0-9\s-]+$/.test(login)
      ? supabase.from('bbbt_identities').select('id,application_id,full_name,handle,mobile,email,requested_role,status,payload,created_at').eq('mobile', login).maybeSingle()
      : supabase.from('bbbt_identities').select('id,application_id,full_name,handle,mobile,email,requested_role,status,payload,created_at').ilike('handle', normalizedHandle).maybeSingle()
  const { data, error } = await query
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
