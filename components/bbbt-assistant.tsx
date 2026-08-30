'use client'

import { useState } from 'react'
import { Languages, Mic, Send, Siren, Volume2, X } from 'lucide-react'

const languages = ['English', 'हिन्दी', 'বাংলা', 'मराठी', 'తెలుగు', 'தமிழ்', 'ગુજરાતી', 'ಕನ್ನಡ', 'മലയാളം', 'ਪੰਜਾਬੀ', 'অসমীয়া', 'ଓଡ଼ିଆ', 'संस्कृतम्', 'اردو', 'नेपाली', 'कोंकणी', 'سنڌي', 'डोगरी', 'बोड़ो', 'काश्मीरी', 'मणिपुरी', 'संताली']
const speechLocales: Record<string, string> = { English: 'en-IN', 'हिन्दी': 'hi-IN', 'বাংলা': 'bn-IN', 'मराठी': 'mr-IN', 'తెలుగు': 'te-IN', 'தமிழ்': 'ta-IN', 'ગુજરાતી': 'gu-IN', 'ಕನ್ನಡ': 'kn-IN', 'മലയാളം': 'ml-IN', 'ਪੰਜਾਬੀ': 'pa-IN', 'অসমীয়া': 'as-IN', 'ଓଡ଼ିଆ': 'or-IN', 'اردو': 'ur-IN', 'नेपाली': 'ne-IN', 'سنڌي': 'sd-IN', 'काश्मीरी': 'ks-IN', 'मणिपुरी': 'mni-IN', 'संताली': 'sat-IN' }
const answers: Record<string, string> = {
  join: 'BBBT helps verified riders reach SOS responders, Care Pits, blood donors, and trauma support faster. You join a human safety network built for the road.',
  sos: 'Say Help or press SOS. This prototype will start the emergency sequence, show nearby support, and prepare the India emergency fallback numbers.',
  ride: 'Start Ride Mode to keep your route, Care Pits, rider contacts, and safety check-ins together while you travel.',
}

export function LanguagePicker({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState(['English'])
  const toggle = (language: string) => {
    if (language === 'English') return
    setSelected((current) => current.includes(language) ? current.filter((item) => item !== language) : current.length < 3 ? [...current, language] : current)
  }
  return <div className={`language-picker ${compact ? 'compact' : ''}`}><div className="language-head"><Languages size={15} /><span>LANGUAGES / ENGLISH REQUIRED</span><b>{selected.length}/3</b></div><div className="language-options">{languages.map((language) => <button type="button" key={language} className={selected.includes(language) ? 'selected' : ''} onClick={() => toggle(language)}>{language}{selected.includes(language) && <span>✓</span>}</button>)}</div><small>Choose English plus up to two regional languages.</small></div>
}

export function BBBTAssistant({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const [message, setMessage] = useState('')
  const [voiceLanguage, setVoiceLanguage] = useState('English')
  const [answer, setAnswer] = useState(answers.join)
  const respond = (text: string) => { const lower = text.toLowerCase(); setAnswer(lower.includes('sos') || lower.includes('help') ? answers.sos : lower.includes('ride') ? answers.ride : answers.join); setMessage('') }
  const speak = () => { if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance(answer)) }
  const listen = () => { const Recognition = (window as Window & { webkitSpeechRecognition?: new () => { lang: string; start: () => void; onresult: (event: { results: { 0: { 0: { transcript: string } } } }) => void; onend: () => void } }).webkitSpeechRecognition; if (!Recognition) { setAnswer('Voice input is not supported in this browser. You can type your question below.'); return } const recognition = new Recognition(); recognition.lang = speechLocales[voiceLanguage] ?? 'en-IN'; recognition.onresult = (event) => respond(event.results[0][0].transcript); recognition.onend = () => setListening(false); setListening(true); recognition.start() }
  if (!open) return <button className={`assistant-launch ${compact ? 'compact' : ''}`} onClick={() => setOpen(true)} aria-label="Open BBBT voice assistant"><Mic size={18} /><span>BBBT VOICE ASSISTANT</span></button>
  return <aside className="assistant-panel" aria-label="BBBT voice assistant"><button className="assistant-close" onClick={() => setOpen(false)} aria-label="Close assistant"><X size={17} /></button><span className="eyebrow cyan-text">MULTILINGUAL RIDER ASSISTANT · FREE PROTOTYPE</span><label className="assistant-language">VOICE LANGUAGE<select value={voiceLanguage} onChange={(event) => setVoiceLanguage(event.target.value)}>{languages.map((language) => <option key={language}>{language}</option>)}</select></label><h3>Ask without touching<br /><span>the road.</span></h3><p>{answer}</p><div className="assistant-actions"><button onClick={listen} className={listening ? 'listening' : ''}><Mic size={15} /> {listening ? 'LISTENING…' : 'SPEAK'}</button><button onClick={speak}><Volume2 size={15} /> PLAY ANSWER</button></div><div className="assistant-input"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) respond(message) }} placeholder="Ask: why should I join?" /><button onClick={() => respond(message)} aria-label="Send question"><Send size={15} /></button></div><button className="assistant-sos" onClick={() => setAnswer(answers.sos)}><Siren size={15} /> SAY “HELP” / TEST SOS FLOW</button></aside>
}
