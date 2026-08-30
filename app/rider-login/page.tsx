'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, Bike, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RiderLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const isAdminLogin = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('next') === '/admin'
  async function submit(event: FormEvent) { event.preventDefault(); const supabase = createClient(); setBusy(true); setMessage(''); const { error } = await supabase.auth.signInWithPassword({ email, password }); setBusy(false); if (error) { setMessage(error.message.toLowerCase().includes('confirm') ? 'Please confirm your email before signing in.' : 'Invalid email or password.'); return }; window.location.assign(new URLSearchParams(window.location.search).get('next') === '/admin' ? '/admin' : '/dashboard/soscore') }
  async function signInWithGoogle() { const supabase = createClient(); setBusy(true); setMessage(''); const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback${new URLSearchParams(window.location.search).get('next') === '/admin' ? '?next=/admin' : ''}` } }); if (error) { setBusy(false); setMessage(error.message.toLowerCase().includes('provider') ? 'Google login is not configured yet.' : 'Google login could not be started.'); } }
  return <main className="auth-shell"><div className="auth-card"><div className="auth-header"><Link href="/" className="auth-back"><ArrowLeft size={14} /> <span>BACK TO BBBT HOME</span></Link><Link href="/" className="auth-brand"><span>BBBT</span></Link></div><span className="eyebrow cyan-text">{isAdminLogin ? 'ADMIN ACCESS / SECURE LOGIN' : 'RIDER ACCESS / SECURE LOGIN'}</span><h1>Welcome back,<br /><em>{isAdminLogin ? 'admin.' : 'rider.'}</em></h1><p>{isAdminLogin ? 'Sign in to access the protected BBBT operations and analytics console.' : 'Enter the BBBT safety network to manage your emergency profile, bikes and corridor readiness.'}</p><form onSubmit={submit} className="auth-form"><label>EMAIL ADDRESS<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label><label>PASSWORD<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label><button className="btn btn-cyan" disabled={busy}>{busy ? 'AUTHENTICATING...' : isAdminLogin ? 'ADMIN LOGIN' : 'RIDER LOGIN'} <ArrowRight size={16} /></button></form><div className="auth-divider"><span>OR</span></div><button type="button" className="btn btn-google" onClick={signInWithGoogle} disabled={busy}>{busy ? 'CONNECTING...' : 'CONTINUE WITH GOOGLE'} <ArrowRight size={16} /></button>{message && <div className="auth-message">{message}</div>}<div className="auth-foot"><ShieldCheck size={15} /> Your account is protected by Supabase Auth.<Link href="/rider-signup">Create rider account</Link></div></div></main>
}
