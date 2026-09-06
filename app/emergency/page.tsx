import { FeatureExperience } from '@/components/feature-experience'

export const metadata = { title: 'SOS & Emergency Support | BBBT', description: 'A safety-first SOS and emergency support prototype. This simulation does not contact emergency services.', alternates: { canonical: '/emergency' } }

export default function Page() { return <FeatureExperience kind="sos" /> }
