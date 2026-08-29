import BBBTDashboard from '../../../components/bbbt-dashboard'

export const metadata = {
  title: 'Route Corridor — BBBT',
  description: 'Live BBBT rider safety corridor monitoring and response network.',
}

export default function RouteCorridorPage() {
  return <BBBTDashboard mode="route" />
}
