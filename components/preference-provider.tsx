'use client'
import {useEffect} from 'react'
import {GlobalPreferences} from '@/components/global-preferences'
export function PreferenceProvider({children}:{children:React.ReactNode}){useEffect(()=>{const raw=sessionStorage.getItem('bbbt-global-preferences');if(raw){try{const p=JSON.parse(raw);document.documentElement.lang=p.language||'en';document.documentElement.dir=p.language==='ar'?'rtl':'ltr'}catch{}}},[]);return <>{children}<GlobalPreferences/></>}
