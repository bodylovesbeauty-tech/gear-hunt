/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, X } from 'lucide-react';

// --- FULL SOVEREIGN GLOBAL DATABASE (24 Countries + Flags + Languages) ---
const GLOBAL_MARKETS = [
  { name: "Australia", flag: "🇦🇺", code: "AU", lang: "English" },
  { name: "Belgium (Belgique)", flag: "🇧🇪", code: "BE", lang: "Français, Nederlands" },
  { name: "Brazil (Brasil)", flag: "🇧🇷", code: "BR", lang: "Português" },
  { name: "Canada", flag: "🇨🇦", code: "CA", lang: "English, Français" },
  { name: "China (中国)", flag: "🇨🇳", code: "CN", lang: "简体中文" },
  { name: "Egypt (مصر)", flag: "🇪🇬", code: "EG", lang: "العربية, English" },
  { name: "France", flag: "🇫🇷", code: "FR", lang: "Français" },
  { name: "Germany (Deutschland)", flag: "🇩🇪", code: "DE", lang: "Deutsch, English" },
  { name: "India", flag: "🇮🇳", code: "IN", lang: "English, हिन्दी, தமிழ், తెలుగు, ಕನ್ನಡ, മലയാളം, বাংলা, मराठी" },
  { name: "Ireland", flag: "🇮🇪", code: "IE", lang: "English" },
  { name: "Italy (Italia)", flag: "🇮🇹", code: "IT", lang: "Italiano" },
  { name: "Japan (日本)", flag: "🇯🇵", code: "JP", lang: "日本語" },
  { name: "Mexico (México)", flag: "🇲🇽", code: "MX", lang: "Español" },
  { name: "Netherlands (Nederland)", flag: "🇳🇱", code: "NL", lang: "Nederlands, English" },
  { name: "Poland (Polska)", flag: "🇵🇱", code: "PL", lang: "Polski" },
  { name: "Saudi Arabia (المملكة العربية السعودية)", flag: "🇸🇦", code: "SA", lang: "العربية, English" },
  { name: "Singapore", flag: "🇸🇬", code: "SG", lang: "English" },
  { name: "South Africa", flag: "🇿🇦", code: "ZA", lang: "English" },
  { name: "Spain (España)", flag: "🇪🇸", code: "ES", lang: "Español" },
  { name: "Sweden (Sverige)", flag: "🇸🇪", code: "SE", lang: "Svenska" },
  { name: "Turkey (Türkiye)", flag: "🇹🇷", code: "TR", lang: "Türkçe" },
  { name: "United Arab Emirates", flag: "🇦🇪", code: "AE", lang: "العربية, English" },
  { name: "United Kingdom", flag: "🇬🇧", code: "GB", lang: "English" },
  { name: "United States", flag: "🇺🇸", code: "US", lang: "English, Español" }
];

export default function CountrySelectorPage() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState(GLOBAL_MARKETS[8]); // Default India
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-yellow-200">
      {/* HEADER */}
      <nav className="bg-[#131921] py-3 px-6 md:px-10 flex items-center justify-between border-b border-gray-300">
        <Link href="/" className="text-2xl font-black italic uppercase tracking-tighter text-white">
          GEAR<span className="text-yellow-500">HUNT</span>
        </Link>
        <Link href="/" className="text-white hover:text-yellow-500"><X size={24}/></Link>
      </nav>

      <main className="max-w-4xl mx-auto mt-12 px-6 pb-20">
        <h1 className="text-xl font-black uppercase tracking-tight mb-2 italic">Website (Country/Region)</h1>
        
        <div className="border-t border-gray-200 mt-6 pt-8 space-y-10">
          <p className="text-sm font-bold text-gray-700">Select your preferred country/region website:</p>

          {/* --- DROPDOWN WITH SCROLL BAR & FLAGS (image_3ed112.png) --- */}
          <div className="relative w-full max-w-sm" ref={dropdownRef}>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between border-2 border-black bg-white p-3 rounded shadow-sm hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl leading-none">{selectedCountry.flag}</span>
                <div className="text-left leading-none">
                  <p className="text-sm font-black">{selectedCountry.name}</p>
                  <p className="text-[10px] text-gray-500 mt-1 italic">{selectedCountry.lang}</p>
                </div>
              </div>
              <ChevronDown size={20} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* SCROLL BAR ENABLED (image_3ed112.png RED ARROW) */}
            {isOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 shadow-2xl z-50 max-h-125 overflow-y-auto rounded py-2 animate-in fade-in zoom-in duration-150">
                {GLOBAL_MARKETS.map((market) => (
                  <div 
                    key={market.code}
                    onClick={() => { setSelectedCountry(market); setIsOpen(false); }}
                    className="px-4 py-3 hover:bg-[#0066c0] hover:text-white cursor-pointer flex items-center gap-4 border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <span className="text-2xl leading-none">{market.flag}</span>
                    <div className="flex-1">
                      <p className="text-sm font-black leading-none">{market.name}</p>
                      <p className="text-[10px] opacity-80 mt-1 italic">{market.lang}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 max-w-2xl">
            <p className="text-[11px] font-bold text-gray-500 italic">
              NOTE: A new country/region website selection will open in a new tab.
            </p>
            <div className="bg-gray-50 p-6 border border-gray-200 rounded-sm">
              <h3 className="text-sm font-black mb-2 uppercase tracking-tight italic">Changing country/region website</h3>
              <p className="text-[12px] font-bold text-gray-600 leading-tight">
                Changing the country/region you shop from may affect factors including price, shipping options and product availability.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap gap-4">
            <Link href="/" className="px-12 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded shadow-sm text-xs font-black uppercase tracking-tighter">
              Cancel
            </Link>
            <button 
              onClick={() => router.push('/')}
              className="px-12 py-2.5 bg-yellow-400 hover:bg-yellow-500 border border-yellow-500 rounded shadow-md text-xs font-black uppercase tracking-tighter transition-all active:scale-95"
            >
              Go to website
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-10 text-center bg-gray-50 mt-40">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">© 2026, GEARHUNT GLOBAL EMPIRE | EXCELLENCE IN EVERY UNIVERSE</p>
      </footer>
    </div>
  );
}