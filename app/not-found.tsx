'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem', background: '#101413', color: '#f2f4f1' }}>
      <section style={{ maxWidth: '34rem', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#f05a47', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.16em' }}>BBBT / ROUTE NOT FOUND</p>
        <h1 style={{ margin: '1rem 0', fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: .95 }}>This road isn&apos;t mapped.</h1>
        <p style={{ color: '#b8c0bb', lineHeight: 1.6 }}>The page you requested does not exist. Return to the BBBT road system and choose a live route.</p>
        <Link href="/" style={{ display: 'inline-flex', marginTop: '1.5rem', padding: '.85rem 1.1rem', background: '#f05a47', color: '#101413', fontWeight: 700, textDecoration: 'none' }}>Return home ↗</Link>
      </section>
    </main>
  )
}
