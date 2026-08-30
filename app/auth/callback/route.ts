import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next')
  const adminIntent = request.headers.get('cookie')?.split(';').some((cookie) => cookie.trim().startsWith('bbbt_admin_login=1'))
  let destination = adminIntent ? '/admin' : (next?.startsWith('/') ? next : '/dashboard/soscore')
  if (code) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)
    if (user?.email?.toLowerCase() === 'brandbikebrotherhoodtrust@gmail.com') destination = '/admin'
  }
  const response = NextResponse.redirect(new URL(destination, request.url))
  response.cookies.set('bbbt_admin_login', '', { path: '/', maxAge: 0 })
  return response
}
