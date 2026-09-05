import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
