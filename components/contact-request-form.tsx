'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const initial = { contact_type: 'General', regarding: 'General enquiry', full_name: '', mobile: '', alternate_mobile: '', whatsapp: '', email: '', address1: '', address2: '', landmark: '', city: '', district: '', pin_code: '', state: '', subject: '', message: '' }

export default function ContactRequestForm() {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState<'idle'|'saving'|'success'|'error'>('idle')
  const update = (key: keyof typeof initial, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setStatus('saving')
    const { error } = await createClient().from('contact_requests').insert({ ...form, country: 'India', source: 'contact_center', status: 'NEW', attachment_reference: null })
    setStatus(error ? 'error' : 'success'); if (!error) setForm(initial)
  }
  if (status === 'success') return <div className="contact-success" role="status"><strong>Request received.</strong><p>Thank you. BBBT has recorded your request for manual review. This is not a live emergency channel.</p><button className="btn btn-cyan" onClick={() => setStatus('idle')}>Send another request</button></div>
  return <form className="contact-request-form" onSubmit={submit}>
    <div className="form-grid"><label>Contact type<select value={form.contact_type} onChange={(e) => update('contact_type', e.target.value)}><option>General</option><option>Rider</option><option>Group Admin</option><option>Marshal</option><option>Council</option><option>Investor</option><option>Partner</option></select></label><label>Regarding<select value={form.regarding} onChange={(e) => update('regarding', e.target.value)}><option>General enquiry</option><option>Safety & participation</option><option>Partnership</option><option>Investor brief</option><option>Care Pit & safety</option></select></label></div>
    <div className="form-grid"><label>Full name<input required value={form.full_name} onChange={(e) => update('full_name', e.target.value)} /></label><label>Email<input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></label></div>
    <div className="form-grid"><label>Mobile<input required inputMode="tel" value={form.mobile} onChange={(e) => update('mobile', e.target.value)} /></label><label>WhatsApp<input required inputMode="tel" value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} /></label></div>
    <div className="form-grid"><label>Alternate mobile<input required inputMode="tel" value={form.alternate_mobile} onChange={(e) => update('alternate_mobile', e.target.value)} /></label><label>PIN code<input required inputMode="numeric" value={form.pin_code} onChange={(e) => update('pin_code', e.target.value)} /></label></div>
    <div className="form-grid"><label>Address line 1<input required value={form.address1} onChange={(e) => update('address1', e.target.value)} /></label><label>Address line 2<input required value={form.address2} onChange={(e) => update('address2', e.target.value)} /></label></div>
    <div className="form-grid"><label>Landmark<input required value={form.landmark} onChange={(e) => update('landmark', e.target.value)} /></label><label>City<input required value={form.city} onChange={(e) => update('city', e.target.value)} /></label></div>
    <div className="form-grid"><label>District<input required value={form.district} onChange={(e) => update('district', e.target.value)} /></label><label>State<input required value={form.state} onChange={(e) => update('state', e.target.value)} /></label></div>
    <label>Subject<input required value={form.subject} onChange={(e) => update('subject', e.target.value)} /></label><label>Message<textarea required minLength={10} rows={6} value={form.message} onChange={(e) => update('message', e.target.value)} /></label>
    {status === 'error' && <p className="form-error" role="alert">We could not record this request. Please try again.</p>}<button className="btn btn-cyan" disabled={status === 'saving'}>{status === 'saving' ? 'Submitting…' : 'Submit contact request'}</button><small>This form is for non-emergency contact only. For emergencies in India, call 112.</small>
  </form>
}
