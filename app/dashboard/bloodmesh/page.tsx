import BBBTDashboard from '../../../components/bbbt-dashboard'

export const metadata = {
  robots: { index: false, follow: false },
  title: 'Blood & Hospital Mesh — BBBT',
  description: 'Verified BBBT blood and hospital care network prototype.',
}

export default function BloodMeshPage() {
  return <BBBTDashboard mode="blood" />
}
