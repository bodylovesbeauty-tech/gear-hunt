'use client'
import {languages,type LanguageCode} from '@/lib/global-preferences'
import {usePreferences} from '@/components/preference-provider'
import {t} from '@/lib/translations'
export function GlobalPreferences({footer=false}:{footer?:boolean}){const {preferences,setLanguage}=usePreferences();return <div className={footer?'footer-preferences':'global-preferences'}><label title="Change the language used across the BBBT ecosystem."><span>{t('footer.language',preferences.language)}</span><select aria-label="Language" value={preferences.language} onChange={e=>setLanguage(e.target.value as LanguageCode)}>{languages.map(x=><option key={x.code} value={x.code}>{x.nativeLabel} / {x.label}</option>)}</select></label></div>}
