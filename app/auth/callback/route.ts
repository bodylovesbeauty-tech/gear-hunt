import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next')
  let destination = next?.startsWith('/') ? next : '/dashboard/soscore'
  if (code) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)
    if (user?.email?.toLowerCase() === 'brandbikebrotherhoodtrust@gmail.com') destination = '/admin'
  }
  return NextResponse.redirect(new URL(destination, request.url))
}
