import { FeatureExperience } from '@/components/feature-experience'

export const metadata = { title: 'Weather | BBBT', description: 'Live rider weather forecasts for safer journey preparation.', alternates: { canonical: '/weather' } }

export default function WeatherPage() { return <FeatureExperience kind="weather" /> }
