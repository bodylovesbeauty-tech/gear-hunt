import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { PreferenceProvider } from '@/components/preference-provider'
import { GlobalExperienceLayer } from '@/components/global-experience-layer'
const geist=Geist({subsets:['latin'],variable:'--font-geist'}); const geistMono=Geist_Mono({subsets:['latin'],variable:'--font-geist-mono'})
export const metadata:Metadata={metadataBase:new URL('https://www.bbbt.in'),title:{default:'BBBT Trust | Rider Safety & Community Infrastructure',template:'%s | BBBT Trust'},description:'BBBT Trust is designing a safety, emergency-support, community and rider-welfare ecosystem for India’s riding communities.',alternates:{canonical:'/'},openGraph:{type:'website',siteName:'BBBT Trust',locale:'en_IN',title:'BBBT Trust | Rider Safety & Community Infrastructure',description:'A proposed safety and community infrastructure layer for Indian riders.',url:'https://www.bbbt.in/'},twitter:{card:'summary_large_image',title:'BBBT Trust | Rider Safety & Community Infrastructure',description:'A proposed safety and community infrastructure layer for Indian riders.'},robots:{index:true,follow:true},icons:{icon:'/bbbt-favicon.png',apple:'/bbbt-favicon.png'}}
export const viewport:Viewport={themeColor:'#0b0f10',colorScheme:'dark',width:'device-width',initialScale:1}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={`${geist.variable} ${geistMono.variable}`}><body><PreferenceProvider>{children}<GlobalExperienceLayer/></PreferenceProvider></body></html>}
