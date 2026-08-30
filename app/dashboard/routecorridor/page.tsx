import BBBTDashboard from '../../../components/bbbt-dashboard'

export const metadata = {
  robots: { index: false, follow: false },
  title: 'Route Corridor — BBBT',
  description: 'Live BBBT rider safety corridor monitoring and response network.',
}

export default function RouteCorridorPage() {
  return <BBBTDashboard mode="route" />
}
