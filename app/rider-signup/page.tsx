'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { ArrowRight, Bike, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RiderSignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', blood: 'O+' })
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent) { event.preventDefault(); const supabase = createClient(); setBusy(true); setMessage(''); const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`, data: { display_name: form.name, blood_group: form.blood } } }); setBusy(false); if (error) { setMessage(error.message.toLowerCase().includes('password') ? 'Please use a stronger password.' : error.message.toLowerCase().includes('rate') ? 'Please try again later.' : 'We could not create this rider account.'); return }; if (data.session) window.location.assign('/dashboard/soscore'); else setMessage('Account created. Check your email to confirm your rider access.') }
  return <main className="auth-shell"><div className="auth-card auth-wide"><Link href="/" className="auth-brand"><span><Bike size={18} /></span> BBBT</Link><span className="eyebrow cyan-text">REGISTRATION LEDGER / RIDER 01</span><h1>Join the safety<br /><em>network.</em></h1><p>Create your rider account. You can add your profile photo, blood report and up to five bikes after login.</p><form onSubmit={submit} className="auth-form"><label>RIDER NAME<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" /></label><label>EMAIL ADDRESS<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" /></label><label>BLOOD GROUP<select value={form.blood} onChange={(e) => setForm({ ...form, blood: e.target.value })}>{['O+','O-','A+','A-','B+','B-','AB+','AB-'].map((x) => <option key={x}>{x}</option>)}</select></label><label>PASSWORD<input type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="new-password" /></label><button className="btn btn-cyan" disabled={busy}>{busy ? 'CREATING ACCOUNT...' : 'CREATE RIDER ACCOUNT'} <ArrowRight size={16} /></button></form>{message && <div className="auth-message"><CheckCircle2 size={15} /> {message}</div>}<div className="auth-foot">Already registered? <Link href="/rider-login">Rider Login</Link></div></div></main>
}
