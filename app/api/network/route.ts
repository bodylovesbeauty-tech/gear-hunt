import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function token(prefix: string) {
  return `${prefix}-${crypto.randomUUID().replaceAll('-', '').slice(0, 16).toUpperCase()}`
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const type = url.searchParams.get('type')
  const id = url.searchParams.get('id')
  const supabase = createAdminClient()
  if (type === 'GROUP' && id) {
    const { data, error } = await supabase.from('bbbt_groups').select('id,name,share_token,description,group_size,group_handle,status,payload,created_at').or(`id.eq.${id},share_token.eq.${id}`).eq('status', 'ACTIVE').maybeSingle()
    if (error) return NextResponse.json({ error: 'Unable to load group' }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    const members = await supabase.from('bbbt_group_memberships').select('id,user_id,role,status,joined_at,source_referral_id').eq('group_id', data.id).eq('status', 'ACTIVE')
    return NextResponse.json({ group: data, memberships: members.data || [] })
  }
  if (type === 'RIDE' && id) {
    const { data, error } = await supabase.from('bbbt_rides').select('id,group_id,invite_token,creator_id,title,route,date_text,status,payload,created_at').eq('invite_token', id).maybeSingle()
    if (error) return NextResponse.json({ error: 'Unable to load ride' }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
    const members = await supabase.from('bbbt_ride_memberships').select('id,user_id,status,joined_at,source_referral_id').eq('ride_id', data.id)
    return NextResponse.json({ ride: data, memberships: members.data || [] })
  }
  return NextResponse.json({ error: 'Invalid network request' }, { status: 400 })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createAdminClient()
    if (body.action === 'join-group') {
      const { userId, groupId, referralId } = body
      if (!userId || !groupId) return NextResponse.json({ error: 'Missing membership fields' }, { status: 400 })
      const { data, error } = await supabase.from('bbbt_group_memberships').upsert({ id: `GM-${groupId}-${userId}`, group_id: groupId, user_id: userId, role: 'Rider', status: 'ACTIVE', source_referral_id: referralId || null }, { onConflict: 'group_id,user_id' }).select('id,group_id,user_id,role,status,joined_at,source_referral_id').single()
      if (error) throw error
      if (referralId) await supabase.from('bbbt_referrals').update({ join_at: new Date().toISOString(), status: 'JOINED' }).eq('id', referralId)
      return NextResponse.json({ membership: data })
    }
    if (body.action === 'join-ride') {
      const { userId, rideId, referralId } = body
      if (!userId || !rideId) return NextResponse.json({ error: 'Missing membership fields' }, { status: 400 })
      const { data, error } = await supabase.from('bbbt_ride_memberships').upsert({ id: `RM-${rideId}-${userId}`, ride_id: rideId, user_id: userId, source_referral_id: referralId || null }, { onConflict: 'ride_id,user_id' }).select('id,ride_id,user_id,joined_at,source_referral_id').single()
      if (error) throw error
      if (referralId) await supabase.from('bbbt_referrals').update({ join_at: new Date().toISOString(), status: 'JOINED' }).eq('id', referralId)
      return NextResponse.json({ membership: data })
    }
    if (body.action === 'create-ride') {
      const { ride, identity } = body
      if (!ride?.id || !ride?.inviteToken || !ride?.title || !identity?.id) return NextResponse.json({ error: 'Invalid ride payload' }, { status: 400 })
      await supabase.from('bbbt_identities').upsert({ id: identity.id, application_id: identity.applicationId || `APP-${identity.id}`, full_name: identity.fullName || identity.id, handle: identity.handle || identity.id, mobile: identity.mobile || `prototype-${identity.id}`, email: identity.email || null, requested_role: identity.requestedRole || 'Rider', payload: identity }, { onConflict: 'id' })
      const { data, error } = await supabase.from('bbbt_rides').upsert({ id: ride.id, group_id: ride.groupId || null, invite_token: ride.inviteToken, creator_id: identity.id, title: ride.title, route: ride.route, date_text: ride.date, status: ride.status || 'CREATED', payload: ride }, { onConflict: 'id' }).select('id,invite_token').single()
      if (error) throw error
      return NextResponse.json({ ride: data }, { status: 201 })
    }
    if (body.action === 'create-referral') {
      const { referrerUserId, targetType, targetId } = body
      if (!referrerUserId || !targetType) return NextResponse.json({ error: 'Invalid referral payload' }, { status: 400 })
      const { data, error } = await supabase.from('bbbt_referrals').upsert({ id: token('REF'), referrer_user_id: referrerUserId, public_token: token('SHARE'), target_type: targetType, target_id: targetId || null }, { onConflict: 'public_token' }).select('id,referrer_user_id,public_token,target_type,target_id,status,created_at').single()
      if (error) throw error
      return NextResponse.json({ referral: data }, { status: 201 })
    }
    return NextResponse.json({ error: 'Unknown network action' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Unable to persist network action' }, { status: 500 })
  }
}
