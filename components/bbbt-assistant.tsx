'use client'

import { useEffect, useMemo, useState } from 'react'
import { Languages, Mic, Send, Siren, Volume2, X, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react'
import { appendActivity } from '@/lib/rider-journey-data'
import { languages as registryLanguages, readPreferences } from '@/lib/global-preferences'

const languageLabels = registryLanguages.map((language) => language.label)
const speechLocales: Record<string, string> = Object.fromEntries(registryLanguages.map((language) => [language.label, `${language.code === 'hinglish' ? 'hi' : language.code}-IN`]))
const answers = {
  welcome: 'BBBT is a trusted operating layer for India’s riders, connecting safety, emergency support, community and rider welfare.',
  join: 'You can join by creating a rider profile. Signup is available from the public prototype and collects only the information needed for the rider journey.',
  safety: 'Safety Kit is the rider readiness layer. In this prototype you can review readiness and link a vehicle; verified activation requires the existing rider workflow.',
  blood: 'Blood Mesh is a trusted donor and hospital coordination concept. Real matching requires verified data and backend operations; this prototype does not dispatch blood.',
  care: 'Care Pits are trusted roadside support points. The public concept is available now; live availability requires a verified partner network.',
  group: 'Groups help riders coordinate governed rides and community activity. Group permissions remain inside the existing authenticated dashboard.',
  frc: 'The Founding Rider Council is the member-led governance layer for transparent decisions and system accountability.',
  product: 'Product Lab is the existing space for testing BBBT safety concepts and recording prototype feedback.',
  contact: 'You can contact BBBT through the existing Contact page. This assistant does not send a message without using that authorized form.',
  profile: 'Open Profile to review your rider context, vehicles, readiness and language preferences.',
  rides: 'Open Rides to review the existing ride state. Live GPS and emergency dispatch are not provided by this prototype.',
  unavailable: 'I’m not fully sure what you mean. Try asking about BBBT, joining, Safety Kit, Blood Mesh, Care Pits, Groups, FRC, Product Lab, Profile or Rides.',
}

function telemetry(eventType: string, metadata: Record<string, string | number | boolean | null> = {}) {
  if (typeof window === 'undefined') return
  appendActivity({ eventType, actorRiderId: null, role: null, scope: 'voice-assistant', targetType: 'assistant', targetId: null, metadata, source: 'BBBT_VOICE_ASSISTANT' })
}

export function LanguagePicker({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState(['English'])
  const toggle = (language: string) => { if (language === 'English') return; setSelected((current) => current.includes(language) ? current.filter((item) => item !== language) : current.length < 3 ? [...current, language] : current) }
  return <div className={`language-picker ${compact ? 'compact' : ''}`}><div className="language-head"><Languages size={15} /><span>LANGUAGES / ENGLISH REQUIRED</span><b>{selected.length}/3</b></div><div className="language-options">{languageLabels.map((language) => <button type="button" key={language} className={selected.includes(language) ? 'selected' : ''} onClick={() => toggle(language)}>{language}{selected.includes(language) && <span aria-hidden="true">✓</span>}</button>)}</div><small>Choose English plus up to two regional languages.</small></div>
}

export function BBBTAssistant({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState<boolean | null>(null)
  const [message, setMessage] = useState('')
  const [voiceLanguage, setVoiceLanguage] = useState('English')
  const [answer, setAnswer] = useState(answers.welcome)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const [feedbackNote, setFeedbackNote] = useState(false)
  const [authenticated] = useState(() => typeof window !== 'undefined' && Boolean(sessionStorage.getItem('bbbt-demo-session')))

  useEffect(() => { const preference = readPreferences(); const option = registryLanguages.find((item) => item.code === preference.language); if (option) setVoiceLanguage(option.label); setVoiceSupported(typeof window !== 'undefined' && 'webkitSpeechRecognition' in window); }, [])
  const suggestions = useMemo(() => authenticated ? ['What is my profile completion?', 'Open my Profile', 'Open Safety Kit', 'Open Rides'] : ['What is BBBT?', 'How can I join?', 'What is Safety Kit?', 'What is Blood Mesh?'], [authenticated])
  const respond = (text: string) => {
    const lower = text.toLowerCase().trim();
    if (!lower) return
    const intent = lower.includes('profile') ? 'OPEN_PROFILE' : lower.includes('safety') ? 'OPEN_SAFETY_KIT' : lower.includes('ride') ? 'OPEN_RIDES' : lower.includes('blood') ? 'BLOOD_MESH_INFO' : lower.includes('care pit') ? 'CARE_PIT_INFO' : lower.includes('group') ? 'GROUP_INFO' : lower.includes('founding') || lower.includes('frc') ? 'FRC_INFO' : lower.includes('product lab') ? 'PRODUCT_LAB_INFO' : lower.includes('join') || lower.includes('signup') ? 'JOIN_INFO' : lower.includes('contact') ? 'CONTACT_INFO' : lower.includes('sos') || lower.includes('help') ? 'SOS_INFO' : lower.includes('what is bbbt') || lower.includes('bbbt') ? 'BBBT_INFO' : 'UNKNOWN'
    const protectedIntent = ['OPEN_PROFILE', 'OPEN_SAFETY_KIT', 'OPEN_RIDES'].includes(intent)
    if (protectedIntent && !authenticated) { setAnswer('Please log in first. Voice Assistant uses the same authorization as the normal dashboard and cannot open private rider data for visitors.'); telemetry('VOICE_INTENT_FAILED', { intent, reason: 'AUTH_REQUIRED' }); setMessage(''); return }
    const responses: Record<string, string> = { BBBT_INFO: answers.welcome, JOIN_INFO: answers.join, OPEN_PROFILE: 'Opening your authorized Profile.', OPEN_SAFETY_KIT: 'Opening your authorized Safety Kit view.', OPEN_RIDES: answers.rides, BLOOD_MESH_INFO: answers.blood, CARE_PIT_INFO: answers.care, GROUP_INFO: answers.group, FRC_INFO: answers.frc, PRODUCT_LAB_INFO: answers.product, CONTACT_INFO: answers.contact, SOS_INFO: 'SOS is a prototype flow. Use the existing SOS control for the visible prototype sequence; real dispatch requires verified emergency operations.', UNKNOWN: answers.unavailable }
    setAnswer(responses[intent]); setMessage(''); setFeedback(null); telemetry(intent === 'UNKNOWN' ? 'VOICE_INTENT_FAILED' : 'VOICE_INTENT_DETECTED', { intent, language: voiceLanguage }); if (intent === 'OPEN_PROFILE') window.location.href = '/dashboard/profile'; if (intent === 'OPEN_SAFETY_KIT' || intent === 'OPEN_RIDES') window.location.href = '/rider-dashboard'
  }
  const speak = () => { if (typeof window !== 'undefined' && 'speechSynthesis' in window) { const utterance = new SpeechSynthesisUtterance(answer); utterance.lang = speechLocales[voiceLanguage] ?? 'en-IN'; window.speechSynthesis.speak(utterance); telemetry('VOICE_RESPONSE_PLAYED', { language: voiceLanguage }) } }
  const listen = () => { const Recognition = (window as Window & { webkitSpeechRecognition?: new () => { lang: string; start: () => void; onresult: (event: { results: { 0: { 0: { transcript: string } } } }) => void; onend: () => void } }).webkitSpeechRecognition; if (!Recognition) { setVoiceSupported(false); setAnswer('Voice input is not supported by this browser/device. You can type your question below.'); telemetry('VOICE_INPUT_FAILED', { reason: 'UNSUPPORTED' }); return } const recognition = new Recognition(); recognition.lang = speechLocales[voiceLanguage] ?? 'en-IN'; recognition.onresult = (event) => { telemetry('VOICE_INPUT_COMPLETED', { language: voiceLanguage }); respond(event.results[0][0].transcript) }; recognition.onend = () => setListening(false); setListening(true); telemetry('VOICE_INPUT_STARTED', { language: voiceLanguage }); recognition.start() }
  const giveFeedback = (value: 'up' | 'down') => { setFeedback(value); telemetry('VOICE_RESPONSE_FEEDBACK', { value, language: voiceLanguage }); if (value === 'down') setFeedbackNote(true) }
  if (!open) return <button className={`assistant-launch ${compact ? 'compact' : ''}`} onClick={() => { setOpen(true); telemetry('VOICE_ASSISTANT_OPENED') }} aria-label="Open BBBT voice assistant"><Mic size={18} /><span>BBBT VOICE ASSISTANT</span></button>
  return <aside className="assistant-panel" aria-label="BBBT voice assistant"><button className="assistant-close" onClick={() => { setOpen(false); telemetry('VOICE_ASSISTANT_CLOSED') }} aria-label="Close assistant"><X size={17} /></button><span className="eyebrow cyan-text">MULTILINGUAL RIDER ASSISTANT · PROTOTYPE</span><label className="assistant-language">VOICE LANGUAGE<select value={voiceLanguage} onChange={(event) => { setVoiceLanguage(event.target.value); telemetry('VOICE_LANGUAGE_SELECTED', { language: event.target.value }) }}>{languageLabels.map((language) => <option key={language}>{language}</option>)}</select></label>{voiceSupported === false && <small className="assistant-capability-note"><HelpCircle size={13} /> Voice input is unavailable here. Text input remains available.</small>}<h3>Ask without touching<br /><span>the road.</span></h3><p>{answer}</p><div className="assistant-suggestions">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => respond(suggestion)}>{suggestion}</button>)}</div><div className="assistant-actions"><button onClick={listen} className={listening ? 'listening' : ''} disabled={listening}><Mic size={15} /> {listening ? 'LISTENING…' : 'SPEAK'}</button><button onClick={speak}><Volume2 size={15} /> PLAY ANSWER</button></div><div className="assistant-input"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) respond(message) }} placeholder="Ask a BBBT question" /><button onClick={() => respond(message)} aria-label="Send question"><Send size={15} /></button></div><div className="assistant-feedback"><span>Was this helpful?</span><button aria-label="Helpful" className={feedback === 'up' ? 'selected' : ''} onClick={() => giveFeedback('up')}><ThumbsUp size={14} /></button><button aria-label="Not helpful" className={feedback === 'down' ? 'selected' : ''} onClick={() => giveFeedback('down')}><ThumbsDown size={14} /></button>{feedbackNote && <small>Tell us what was missing (optional).</small>}</div><button className="assistant-sos" onClick={() => respond('help')}><Siren size={15} /> SAY “HELP” / VIEW SOS FLOW</button><small className="assistant-privacy-note">Responses use public BBBT information. Raw speech and private conversations are not stored by default.</small></aside>
}
