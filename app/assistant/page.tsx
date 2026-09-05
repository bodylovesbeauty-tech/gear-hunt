import { BBBTAssistant } from '@/components/bbbt-assistant'

export const metadata = {
  title: 'BBBT Voice Assistant',
  robots: { index: false, follow: false },
}

export default function AssistantPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <span className="eyebrow cyan-text">BBBT VOICE ASSISTANT / PROTOTYPE</span>
        <h1>Ask about<br /><em>the road ahead.</em></h1>
        <p className="auth-lede">Use the assistant for BBBT information, rider safety concepts, community guidance and authorized rider actions.</p>
        <BBBTAssistant />
      </section>
    </main>
  )
}
