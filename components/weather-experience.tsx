'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, CloudRain, MapPin, Search, Sun, Wind } from 'lucide-react'
import Link from 'next/link'
import WeatherForecast from '@/components/weather-forecast'
import '@/components/weather-experience.css'

export function WeatherExperience() {
  const [expanded, setExpanded] = useState<number | null>(null)
  const faqItems = [
    ['Is this forecast live?', 'Yes. Real-time data from Open-Meteo updates when you refresh.'],
    ['Which cities are supported?', 'Bengaluru, Mysuru, Pune, and Delhi. More corridors coming.'],
    ['What if I\'m riding elsewhere?', 'The forecast applies to listed corridor cities. For other locations, use official weather services.'],
    ['Does weather predict SOS need?', 'No. Weather informs preparation. Check local alerts and your own readiness.'],
  ]

  return (
    <main className="wx-page">
      <header className="wx-hero">
        <div className="wx-hero__content">
          <span className="wx-label">WEATHER / LIVE RIDER FORECAST</span>
          <h1>Know the conditions before you roll.</h1>
          <p>A real forecast from Open-Meteo for choosing a city, checking five days ahead and making a better go/no-go decision before the ride.</p>
          <div className="wx-actions">
            <Link className="wx-button wx-button--primary" href="/signup?role=Rider">JOIN BBBT <ArrowRight size={16} /></Link>
            <Link className="wx-button" href="#forecast">VIEW FORECAST</Link>
          </div>
        </div>
        <div className="wx-hero__visual">
          <div className="wx-visual-card">
            <CloudRain size={52} />
            <strong>LIVE FORECAST</strong>
            <span>Open-Meteo · Choose below</span>
            <div className="wx-bars">
              <i style={{ height: '35%' }} />
              <i style={{ height: '60%' }} />
              <i style={{ height: '90%' }} />
              <i style={{ height: '55%' }} />
              <i style={{ height: '75%' }} />
            </div>
            <small>RAIN · WIND · TEMPERATURE</small>
          </div>
        </div>
      </header>

      <section className="wx-section">
        <span className="wx-label">WHY THIS MATTERS</span>
        <h2>Weather is context. It is not destiny.</h2>
        <div className="wx-points">
          <article>
            <CheckCircle2 size={20} />
            <h3>Five-day view</h3>
            <p>Temperature, rain probability and wind in one calm rider-focused panel. No sensationalism, just data.</p>
          </article>
          <article>
            <CheckCircle2 size={20} />
            <h3>Decision support</h3>
            <p>Choose your corridor, see the forecast, and decide if conditions support your plan or suggest a reschedule.</p>
          </article>
          <article>
            <CheckCircle2 size={20} />
            <h3>Preparation</h3>
            <p>Rain, wind and temperature inform gear, route and timing. They do not replace rider judgment or local alerts.</p>
          </article>
        </div>
      </section>

      <section className="wx-section wx-section--demo">
        <span className="wx-label">LIVE FORECAST EXPERIENCE</span>
        <h2>Select a city to load five days of live weather.</h2>
        <div className="wx-demo-container">
          <WeatherForecast />
        </div>
      </section>

      <section className="wx-section">
        <span className="wx-label">KEY BOUNDARIES</span>
        <div className="wx-boundaries">
          <div className="wx-boundary">
            <strong>No emergency alerts</strong>
            <p>The forecast shows conditions. For severe warnings, check official local alerts (IMD, weather bureaus).</p>
          </div>
          <div className="wx-boundary">
            <strong>No push notifications</strong>
            <p>Load the forecast when you check it. This prototype does not send alerts to your device.</p>
          </div>
          <div className="wx-boundary">
            <strong>No GPS integration</strong>
            <p>Select your corridor city manually. Automatic location-based forecast is not connected in this prototype.</p>
          </div>
          <div className="wx-boundary">
            <strong>No historical data</strong>
            <p>The forecast shows the next five days only. Past weather and trends are not stored here.</p>
          </div>
        </div>
      </section>

      <section className="wx-section wx-section--faq">
        <span className="wx-label">FAQ</span>
        <h2>Clear answers before you ride.</h2>
        {faqItems.map(([q, a], i) => (
          <div className="wx-faq" key={q}>
            <button aria-expanded={expanded === i} onClick={() => setExpanded(expanded === i ? null : i)}>
              {q}
              <span>{expanded === i ? '−' : '+'}</span>
            </button>
            {expanded === i && <p>{a}</p>}
          </div>
        ))}
      </section>

      <section className="wx-section wx-section--connect">
        <h2>Next steps in BBBT.</h2>
        <div className="wx-connect-links">
          <Link href="/corridor" className="wx-link-card">
            <strong>Navigation</strong>
            <span>Route preview with weather context</span>
            <ArrowRight size={18} />
          </Link>
          <Link href="/sos" className="wx-link-card">
            <strong>SOS & Emergency</strong>
            <span>When readiness becomes critical</span>
            <ArrowRight size={18} />
          </Link>
          <Link href="/start-ride" className="wx-link-card">
            <strong>Start Ride</strong>
            <span>Begin with state and safety visible</span>
            <ArrowRight size={18} />
          </Link>
          <Link href="/assistant" className="wx-link-card">
            <strong>Voice Assistant</strong>
            <span>Ask before you act</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="wx-footer">
        <h2>Ready to ride with BBBT?</h2>
        <p>Join as a Rider or connect if you represent a partner service.</p>
        <div className="wx-actions">
          <Link className="wx-button wx-button--primary" href="/signup?role=Rider">JOIN BBBT <ArrowRight size={16} /></Link>
          <Link className="wx-button" href="/contact">CONNECT WITH BBBT</Link>
        </div>
      </footer>
    </main>
  )
}
