'use client'

import { useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'

type Location = { id: string; zone: string; state: string; district: string; city: string; rider_count: number }
const geoUrl = 'https://cdn.jsdelivr.net/npm/india-states@1.0.0/india_states.geojson'

export default function IndiaRiderMap({ locations }: { locations: Location[] }) {
  const [zoom, setZoom] = useState(1)
  const [selected, setSelected] = useState('All India')
  const totals = useMemo(() => locations.reduce((sum, item) => sum + item.rider_count, 0), [locations])
  const top = [...locations].sort((a, b) => b.rider_count - a.rider_count).slice(0, 6)
  return <div className="india-map-panel"><div className="map-heading"><div><span className="eyebrow">NATIONAL INTEREST MAP</span><h2>{selected}</h2></div><div className="map-total"><strong>{totals}</strong><small>INTERESTED RIDERS</small></div></div><div className="map-stage"><ComposableMap projection="geoMercator" projectionConfig={{ scale: 950, center: [82, 22] }}><ZoomableGroup zoom={zoom} onMoveEnd={({ zoom: nextZoom }) => setZoom(nextZoom)}><Geographies geography={geoUrl}>{({ geographies }) => geographies.map((geo) => { const stateName = geo.properties?.ST_NM || geo.properties?.name || 'India'; const count = locations.filter((item) => item.state.toLowerCase() === String(stateName).toLowerCase()).reduce((sum, item) => sum + item.rider_count, 0); return <Geography key={geo.rsmKey} geography={geo} onClick={() => setSelected(String(stateName))} style={{ default: { fill: count ? '#1b6b70' : '#132729', outline: 'none', stroke: '#071012', strokeWidth: .7 }, hover: { fill: '#00d9d9', outline: 'none' }, pressed: { fill: '#d65c42', outline: 'none' } }} /> })}</Geographies></ZoomableGroup></ComposableMap><div className="map-zoom"><button type="button" onClick={() => setZoom((value) => Math.min(4, value + .5))}>+</button><button type="button" onClick={() => setZoom((value) => Math.max(1, value - .5))}>−</button></div></div><div className="map-ranking">{top.length ? top.map((item) => <button type="button" key={item.id} onClick={() => setSelected(`${item.city}, ${item.state}`)}><span>{item.city}<small>{item.district} · {item.zone}</small></span><b>{item.rider_count}</b></button>) : <div className="admin-empty">Add location rows in Supabase to activate city/state analytics.</div>}</div></div>
}
