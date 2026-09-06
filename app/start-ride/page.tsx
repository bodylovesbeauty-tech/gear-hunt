import { FeatureExperience } from '@/components/feature-experience'

export const metadata = { title: 'Start Ride | BBBT', description: 'A local-state rider journey prototype for preparing, starting and ending a ride safely.', alternates: { canonical: '/start-ride' } }

export default function StartRidePage() { return <FeatureExperience kind="ride" /> }
