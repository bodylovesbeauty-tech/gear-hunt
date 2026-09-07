'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, Flag, MapPin, Navigation, Users } from 'lucide-react'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface CorridorRider { name: string; speed: string; bloodGroup: string; status: 'moving' | 'stopped' | 'sos' }
interface CorridorWaypoint { title: string; type: 'start' | 'checkpoint' | 'carepit' | 'hazard' | 'finish'; desc: string }

const corridorCoordinates: [number, number][] = [[19.0176, 72.8173], [18.9988, 72.8182], [18.9812, 72.8198], [18.9629, 72.8207], [18.9446, 72.8215], [18.9219, 72.8226]]
const markerColors: Record<CorridorWaypoint['type'], string> = { start: '#00d85a', checkpoint: '#4da6e8', carepit: '#d4a017', hazard: '#d02030', finish: '#a020f0' }
const markerIcons = Object.fromEntries(Object.entries(markerColors).map(([type, color]) => [type, L.divIcon({ className: 'corridor-marker', html: `<span style="background:${color}">${type === 'start' ? 'A' : type === 'finish' ? 'F' : type === 'checkpoint' ? 'R' : type === 'carepit' ? '+' : '!'}</span>`, iconSize: [28, 28], iconAnchor: [14, 14] })])) as Record<CorridorWaypoint['type'], L.DivIcon>

export function CorridorExperience() {
  const [view] = useState<'demo' | 'live'>('demo')
  const [selectedWaypoint, setSelectedWaypoint] = useState<number | null>(null)

  const riders: CorridorRider[] = [
    { name: 'Arjun (You)', speed: 'Moving · 42 km/h', bloodGroup: 'O+', status: 'moving' },
    { name: 'Neha S.', speed: 'Moving · 39 km/h', bloodGroup: 'O−', status: 'moving' },
    { name: 'Rohit D.', speed: 'Stopped', bloodGroup: 'B+', status: 'stopped' },
    { name: 'Farhan A.', speed: 'SOS', bloodGroup: 'A+', status: 'sos' },
  ]

  const waypoints: CorridorWaypoint[] = [
    { title: 'Bandra Fort — Ride Start', type: 'start', desc: 'Start · Muster point · 24 riders' },
    { title: 'Sea-Link Care Pit', type: 'carepit', desc: 'Care Pit · First aid · tools · water' },
    { title: 'Worli Sharp Bend', type: 'hazard', desc: 'Hazard · Accident-prone · slow to 30' },
    { title: 'Hall Ali Checkpoint', type: 'checkpoint', desc: 'Checkpoint · Marshal relay point' },
    { title: 'Lilavati Trauma Cover', type: 'carepit', desc: 'Care Pit · Blood bank · ICU · 4 min' },
    { title: 'Marine Drive — Finish', type: 'finish', desc: 'Finish · Route ends · debrief' },
  ]

  const recentEvent = 'Farhan A. triggered SOS on the corridor near Hall Ali. Nearest marshal + care pit dispatched.'

  return (
    <main className="corridor-page">
      {/* Header */}
      <header className="corridor-header">
        <div className="corridor-header__top">
          <div>
            <div className="corridor-id"><span className="corridor-eyebrow">ROUTE CORRIDOR</span></div>
            <h1>Coastal West Corridor</h1>
            <p>West Zone · Mumbai District</p>
          </div>
          <div className="corridor-header__badge">
            <span className="badge badge--live">Live · Monitored</span>
          </div>
        </div>

        {/* Stats */}
        <div className="corridor-stats">
          <div className="stat">
            <MapPin size={20} />
            <div><span className="stat-label">Corridor length</span><strong>18.4 km</strong></div>
          </div>
          <div className="stat">
            <Users size={20} />
            <div><span className="stat-label">SOS coverage</span><strong>96%</strong></div>
          </div>
          <div className="stat">
            <Flag size={20} />
            <div><span className="stat-label">Care pits</span><strong>2</strong></div>
          </div>
          <div className="stat">
            <Navigation size={20} />
            <div><span className="stat-label">Active riders</span><strong>24</strong></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="corridor-tabs">
          <button className="tab tab--active">SOS Core</button>
          <button className="tab tab--active tab--red">Route Corridor</button>
        </div>
      </header>

      {/* Map Container */}
      <div className="corridor-map-container">
        <div className="corridor-map">
          <MapContainer center={[18.972, 72.82]} zoom={13} scrollWheelZoom className="corridor-leaflet-map">
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline positions={corridorCoordinates} pathOptions={{ color: '#ef3340', weight: 5, opacity: 0.9 }} />
            {waypoints.map((wp, i) => <Marker key={wp.title} position={corridorCoordinates[i]} icon={markerIcons[wp.type]} eventHandlers={{ click: () => setSelectedWaypoint(i) }} />)}
          </MapContainer>
        </div>

        {/* Map Legend */}
        <div className="corridor-legend">
          <div className="legend-item"><span className="legend-dot" style={{ background: '#00d85a' }} />Start</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: '#4da6e8' }} />Checkpoint</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: '#d4a017' }} />Care pit</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: '#d02030' }} />Hazard / SOS</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: '#a020f0' }} />Finish</div>
        </div>
      </div>

      {/* Live Event */}
      <div className="corridor-event">
        <AlertCircle size={20} style={{ color: '#d02030' }} />
        <span><strong>Farhan A.</strong> triggered SOS on the corridor near Hall Ali. Nearest marshal + care pit dispatched.</span>
      </div>

      {/* Riders & Waypoints Grid */}
      <div className="corridor-grid">
        {/* ON THE CORRIDOR */}
        <section className="corridor-section">
          <h3>ON THE CORRIDOR</h3>
          <div className="rider-cards">
            {riders.map((rider, i) => (
              <div key={i} className={`rider-card rider-card--${rider.status}`}>
                <div className="rider-card__status">
                  <span className="rider-dot" style={{ background: rider.status === 'sos' ? '#d02030' : rider.status === 'stopped' ? '#d4a017' : '#00d85a' }} />
                </div>
                <div className="rider-card__info">
                  <strong>{rider.name}</strong>
                  <span className="rider-card__speed">{rider.speed}</span>
                </div>
                <div className="rider-card__badge">{rider.bloodGroup}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CORRIDOR WAYPOINTS */}
        <section className="corridor-section">
          <h3>CORRIDOR WAYPOINTS</h3>
          <div className="waypoint-cards">
            {waypoints.map((wp, i) => (
              <div
                key={i}
                className={`waypoint-card waypoint-card--${wp.type} ${selectedWaypoint === i ? 'waypoint-card--selected' : ''}`}
                onClick={() => setSelectedWaypoint(i)}
              >
                <div className="waypoint-icon">
                  {wp.type === 'start' && <Flag size={18} />}
                  {wp.type === 'finish' && <Flag size={18} />}
                  {wp.type === 'checkpoint' && <MapPin size={18} />}
                  {wp.type === 'carepit' && <AlertCircle size={18} />}
                  {wp.type === 'hazard' && <AlertCircle size={18} />}
                </div>
                <div className="waypoint-info">
                  <strong>{wp.title}</strong>
                  <span className="waypoint-desc">{wp.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer with links */}
      <footer className="corridor-footer">
        <p>BBBT · Brand Biker Brotherhood Trust — safety infrastructure. SOS sits above every other feature.</p>
        <div className="corridor-footer__links">
          <Link href="/sos">← Back to SOS</Link>
          <Link href="/signup?role=Rider">Join BBBT</Link>
        </div>
      </footer>
    </main>
  )
}
