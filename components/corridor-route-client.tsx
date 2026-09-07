'use client'

import dynamic from 'next/dynamic'

const CorridorExperience = dynamic(() => import('@/components/corridor-experience').then((module) => module.CorridorExperience), { ssr: false, loading: () => <main className="corridor-page" aria-busy="true" /> })

export default function CorridorRouteClient() { return <CorridorExperience /> }
