import BBBTDashboard from '../../../components/bbbt-dashboard'

export const metadata = {
  title: 'SOS Core — BBBT',
  description: 'BBBT emergency response command center with verified rider and responder infrastructure.',
}

export default function SosCorePage() {
  return <BBBTDashboard mode="sos" />
}
