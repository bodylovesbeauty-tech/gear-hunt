import { SosEmergency } from '@/components/sos-emergency'

export const metadata = {
  title: 'SOS & Emergency | BBBT',
  description: 'BBBT rider SOS command: hold-to-send emergency signal, Blood Mesh donors, Care Pit network and auto-alerted emergency contacts. Prototype — no real dispatch.',
  alternates: { canonical: '/sos' },
}

export default function Page() {
  return <SosEmergency />
}
