'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

export default function RouteMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return
    let map: import('leaflet').Map | undefined
    let cancelled = false
    import('leaflet').then((leaflet) => {
      if (cancelled || !mapRef.current) return
      const L = leaflet.default
      const riderIcon = (color: string) => L.divIcon({ className: 'bbbt-map-icon', html: `<span style="--marker:${color}">●</span>`, iconSize: [26, 26], iconAnchor: [13, 13] })
      map = L.map(mapRef.current, { zoomControl: false, attributionControl: true }).setView([12.55, 76.7], 9)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map)
    const route: L.LatLngExpression[] = [[12.9716, 77.5946], [12.88, 77.55], [12.73, 77.42], [12.62, 77.35], [12.49, 77.28], [12.2958, 76.6394]]
    L.polyline(route, { color: '#00f6ff', weight: 5, opacity: .9 }).addTo(map)
    L.polyline(route, { color: '#00ff66', weight: 12, opacity: .16 }).addTo(map)
    const points = [
      { at: [12.9716, 77.5946] as L.LatLngExpression, label: 'BENGALURU / START', color: '#00ff66' },
      { at: [12.73, 77.42] as L.LatLngExpression, label: 'CARE PIT 01 / 42 KM', color: '#ffb000' },
      { at: [12.49, 77.28] as L.LatLngExpression, label: 'MARSHAL NODE / 67 KM', color: '#00f6ff' },
      { at: [12.2958, 76.6394] as L.LatLngExpression, label: 'MYSURU / ARRIVAL', color: '#00ff66' },
    ]
    points.forEach((point) => L.marker(point.at, { icon: riderIcon(point.color) }).addTo(map).bindTooltip(point.label, { direction: 'top', offset: [0, -10] }))
      map.fitBounds(L.latLngBounds(route), { padding: [28, 28] })
    })
    return () => { cancelled = true; map?.remove() }
  }, [])

  return <div ref={mapRef} className="real-route-map" aria-label="Live Bengaluru to Mysuru route map" />
}
