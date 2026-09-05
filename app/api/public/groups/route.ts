import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function toPublicGroup(row: any, memberCount = 0) {
  return { targetId: row.id, identifier: row.share_token, name: row.name, createdAt: row.created_at, memberCount, image: row.payload?.image || null, description: row.description || null, location: row.payload?.location || null, status: 'ACTIVE' as const }
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const url = new URL(request.url)
  const identifier = url.searchParams.get('identifier')
  let query = supabase.from('bbbt_groups').select('id,name,share_token,description,group_size,group_handle,status,payload,created_at').eq('status', 'ACTIVE')
  if (identifier) query = query.eq('share_token', identifier)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: 'Unable to load groups' }, { status: 500 })
  const groups = await Promise.all((data || []).map(async row => {
    const members = await supabase.from('bbbt_group_memberships').select('id', { count: 'exact', head: true }).eq('group_id', row.id).eq('status', 'ACTIVE')
    return toPublicGroup(row, members.count || 0)
  }))
  return NextResponse.json({ groups })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const identity = body.identity
    const group = body.group
    if (!identity?.id || !group?.id || !group?.shareToken || !group?.name) return NextResponse.json({ error: 'Invalid group payload' }, { status: 400 })
    const supabase = createAdminClient()
    const { error: identityError } = await supabase.from('bbbt_identities').upsert({ id: identity.id, application_id: identity.applicationId || `APP-${identity.id}`, full_name: identity.fullName || 'Prototype Rider', handle: identity.handle || `@${identity.id.toLowerCase()}`, mobile: identity.mobile || `prototype-${identity.id}`, email: identity.email || null, requested_role: identity.requestedRole || 'Rider', payload: identity }, { onConflict: 'id' })
    if (identityError) throw identityError
    const { error: groupError } = await supabase.from('bbbt_groups').upsert({ id: group.id, name: group.name, share_token: group.shareToken, admin_id: identity.id, description: group.description || null, group_size: group.groupSize || null, group_handle: group.groupHandle || null, payload: group }, { onConflict: 'id' })
    if (groupError) throw groupError
    const { error: membershipError } = await supabase.from('bbbt_group_memberships').upsert({ id: `GM-${group.id}-${identity.id}`, group_id: group.id, user_id: identity.id, role: 'Group Admin' }, { onConflict: 'group_id,user_id' })
    if (membershipError) throw membershipError
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unable to save group' }, { status: 500 })
  }
}
