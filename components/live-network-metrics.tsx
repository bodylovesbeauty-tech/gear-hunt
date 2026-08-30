'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Metrics = { visitors: number; registered_riders: number; live_riders: number; mobile_riders: number; desktop_riders: number; tablet_riders: number }
const empty: Metrics = { visitors: 0, registered_riders: 0, live_riders: 0, mobile_riders: 0, desktop_riders: 0, tablet_riders: 0 }

function getDevice() {
  if (window.matchMedia('(max-width: 640px)').matches) return 'mobile'
  if (window.matchMedia('(max-width: 1024px)').matches) return 'tablet'
  return 'desktop'
}

function visitorId() {
  const match = document.cookie.match(/(?:^|; )bbbt_visitor=([^;]+)/)
  if (match) return decodeURIComponent(match[1])
  const id = crypto.randomUUID()
  document.cookie = `bbbt_visitor=${encodeURIComponent(id)}; max-age=31536000; path=/; SameSite=Lax`
  return id
}

export default function LiveNetworkMetrics() {
  const [metrics, setMetrics] = useState<Metrics>(empty)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const device = getDevice()
    const id = visitorId()
    let active = true
    const sync = async () => {
      await supabase.from('site_visitors').upsert({ visitor_id: id, last_seen: new Date().toISOString(), device_type: device })
      const { data: auth } = await supabase.auth.getUser()
      if (auth.user) await supabase.from('rider_presence').upsert({ user_id: auth.user.id, device_type: device, last_seen: new Date().toISOString() })
      const { data } = await supabase.rpc('get_live_network_metrics')
      if (active && data) { setMetrics(data as Metrics); setReady(true) }
    }
    sync()
    const timer = window.setInterval(sync, 30000)
    return () => { active = false; window.clearInterval(timer) }
  }, [])

  const items = [
    { value: metrics.visitors, label: 'Total website visitors', status: ready ? 'REAL UNIQUE VISITORS' : 'SYNCING NETWORK' },
    { value: metrics.live_riders, label: 'Riders online now', status: `${metrics.mobile_riders} mobile · ${metrics.desktop_riders + metrics.tablet_riders} web` },
    { value: metrics.registered_riders, label: 'Registered riders', status: 'BBBT RIDER NETWORK' },
  ]

  return <section className="metrics live-metrics" aria-label="Live BBBT network metrics">{items.map((item, index) => <div className="metric" key={item.label}><span className={`metric-icon ${index === 0 ? 'cyan' : index === 1 ? 'green' : 'red-text'}`}>{index === 1 ? '●' : index === 2 ? '+' : '◌'}</span><div><b>{ready ? item.value.toLocaleString('en-IN') : '—'}</b><small>{item.label}</small><span className="metric-status">{item.status}</span></div></div>)}</section>
}

export { LiveNetworkMetrics }
