/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, ShoppingCart, MapPin, ChevronDown, Menu, X, User, ChevronLeft, ChevronRight, Globe 
} from 'lucide-react';

// --- DATA LOCKS: STEPS 1-15 PERMANENT REPOSITORY ---
const HERO_IMAGES = [
  "https://m.media-amazon.com/images/I/71Y8X-h5O9L._SX3000_.jpg",
  "https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg",
  "https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg"
];

const GEARHUNT_CATEGORIES = [
  "All", "Car & Bike", "Sports & Gym", "Home & Garden", 
  "Safety Gear", "Industrial Gear", "Community", 
  "Live TV", "Best Seller", "Today's Deals"
];

const COUNTRY_CONFIGS = {
  IN: { name: "India", flag: "🇮🇳", label: "Indian pincode" },
  US: { name: "United States", flag: "🇺🇸", label: "US Zip Code" },
  UK: { name: "United Kingdom", flag: "🇬🇧", label: "UK Zip Code" }
};

export default function GearHuntMasterSovereign() {
  // --- VAJRA-LOCK STATES (Nothing Missing) ---
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isSearchCategoryOpen, setIsSearchCategoryOpen] = useState(false);
  const [isLangHovered, setIsLangHovered] = useState(false); 
  const [countryCode, setCountryCode] = useState('IN');
  const [currentLocation, setCurrentLocation] = useState('India');
  const [pincode, setPincode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const dropdownRef = useRef(null);
  
  const activeConfig = COUNTRY_CONFIGS[countryCode];

  useEffect(() => {
    const handleClickOutside = (e) => { 
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsSearchCategoryOpen(false); 
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <main className="min-h-screen bg-[#eaeded] text-black relative font-sans selection:bg-yellow-500/30 overflow-x-hidden">
      
      {/* STEP 14: SIDE MENU */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-200 flex animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-black/80" onClick={() => setIsSideMenuOpen(false)}></div>
          <div className="relative w-80 bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <Link href="/auth/signin" className="bg-[#232f3e] p-4 text-white flex items-center gap-3 shrink-0">
              <User size={28} className="bg-white/20 rounded-full p-1" />
              <span className="text-lg font-black italic">Hello, Sign in</span>
            </Link>
            <div className="p-4 space-y-6 overflow-y-auto no-scrollbar">
              <section>
                <h3 className="text-sm font-black uppercase text-gray-800 mb-2 px-2 tracking-widest italic">Gear Universes</h3>
                {GEARHUNT_CATEGORIES.slice(1).map(cat => (
                  <Link key={cat} href="#" className="block p-2 text-sm font-bold hover:bg-gray-100 rounded transition-colors">{cat}</Link>
                ))}
              </section>
              <section className="border-t pt-4">
                <h3 className="text-sm font-black uppercase text-gray-800 mb-2 px-2 tracking-widest italic">Help & Settings</h3>
                <Link href="/account" className="block p-2 text-sm font-bold hover:bg-gray-100 rounded transition-colors">Your Account</Link>
                <div className="p-2 text-sm font-bold flex items-center gap-2 hover:bg-gray-100 cursor-pointer rounded">
                  <Globe size={16} className="text-gray-400" /> English
                </div>
                <div className="p-2 text-sm font-bold flex items-center gap-2 hover:bg-gray-100 cursor-pointer rounded">
                  <span className="text-base">{activeConfig.flag}</span> {activeConfig.name}
                </div>
                <Link href="/auth/signin" className="block p-2 text-sm font-bold hover:bg-gray-100 rounded transition-colors">Sign in</Link>
              </section>
            </div>
            <button onClick={() => setIsSideMenuOpen(false)} className="absolute top-2 -right-12 text-white transition-transform hover:rotate-90"><X size={36} /></button>
          </div>
        </div>
      )}

      {/* STEP 8: LOCATION POPUP */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-100 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-93.75 rounded-lg shadow-2xl border animate-in fade-in duration-200">
            <div className="bg-gray-100 p-4 flex justify-between items-center border-b">
              <h2 className="font-black uppercase text-sm italic tracking-tighter">Choose your location</h2>
              <button onClick={() => setIsLocationModalOpen(false)}><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[11px] font-bold text-gray-600 leading-tight">Select a delivery location to see product availability</p>
              <Link href="/account/addresses" onClick={() => setIsLocationModalOpen(false)} className="block text-[11px] font-black text-blue-600 hover:text-orange-600 hover:underline transition-colors">Add an address or pick-up point</Link>
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400 font-black uppercase italic">or enter an {activeConfig.label}</span>
                <div className="flex gap-2">
                  <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} className="flex-1 border-2 border-gray-300 p-2 rounded text-sm font-bold outline-orange-500 transition-all" placeholder={`Enter ${activeConfig.label}`} />
                  <button onClick={() => { if(pincode) { setCurrentLocation(pincode); setIsLocationModalOpen(false); } }} className="bg-yellow-400 border border-yellow-500 px-6 py-2 rounded font-black text-xs uppercase shadow-md active:scale-95 transition-all">Apply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 12/13: TICKER (Resolved: Single Italic) */}
      <div className="bg-[#febd69] h-8 flex items-center border-b border-gray-300 overflow-hidden relative z-50">
        <div className="flex animate-marquee whitespace-nowrap font-black uppercase text-[10px] tracking-widest italic">
           🏆 World's 1st AI Social Shopping for Gear Enthusiasts | 🚚 Fast Delivery to {activeConfig.name} | ✨ GearHunt Universe expansion live | 🔄 7-Day Easy Returns
        </div>
      </div>

      <nav className="sticky top-0 z-50 bg-[#131921] text-white">
        <div className="max-w-375 mx-auto px-4 py-2 flex items-center gap-2">
          {/* STEP 1: LOGO (Resolved: Single Italic) */}
          <Link href="/" className="text-2xl font-black italic uppercase tracking-tighter shrink-0">
            GEAR<span className="text-yellow-500">HUNT</span>
          </Link>
          
          <div onClick={() => setIsLocationModalOpen(true)} className="hidden lg:flex flex-col border border-transparent hover:border-white p-1 px-2 cursor-pointer font-black uppercase shrink-0 transition-all">
            <span className="text-[10px] text-gray-400 leading-none italic tracking-tighter">Deliver to</span>
            <div className="flex items-center gap-1 text-sm tracking-tighter"><MapPin size={14} className="text-yellow-500"/> {currentLocation}</div>
          </div>

          <div className="flex-1 flex h-10 rounded-md bg-white mx-2 focus-within:ring-2 ring-yellow-500 relative transition-all">
            <div ref={dropdownRef} className="relative h-full">
              <button onClick={() => setIsSearchCategoryOpen(!isSearchCategoryOpen)} className="bg-gray-100 px-4 h-full text-[11px] font-black text-gray-600 border-r uppercase flex items-center gap-1 hover:bg-gray-200 transition-colors tracking-tighter">{selectedCategory} <ChevronDown size={12}/></button>
              {isSearchCategoryOpen && (
                <div className="absolute top-10 left-0 w-52 bg-white border border-gray-300 shadow-xl z-50 py-2 animate-in fade-in">
                  {GEARHUNT_CATEGORIES.map(cat => <button key={cat} onClick={() => { setSelectedCategory(cat); setIsSearchCategoryOpen(false); }} className="w-full text-left px-4 py-2 text-[11px] font-black text-black hover:bg-[#0066c0] hover:text-white uppercase transition-colors">{cat}</button>)}
                </div>
              )}
            </div>
            <input type="text" placeholder={`Search in ${selectedCategory} Universe...`} className="flex-1 px-4 text-black text-sm outline-none font-bold" />
            <button className="bg-[#febd69] px-6 text-black hover:bg-yellow-500 transition-colors"><Search size={22} strokeWidth={3}/></button>
          </div>

          <div className="flex items-center gap-4 text-xs font-black uppercase relative shrink-0">
            {/* STEP 15: HOVER LANG (Resolved: Single top-9.5 & z-100) */}
            <div 
              onMouseEnter={() => setIsLangHovered(true)} 
              onMouseLeave={() => setIsLangHovered(false)}
              className="relative py-2 flex items-center gap-1 border border-transparent hover:border-white p-2 cursor-pointer transition-all"
            >
              <span className="text-lg leading-none">{activeConfig.flag}</span>
              <span className="text-[12px] font-black uppercase">EN</span>
              <ChevronDown size={10} className="text-gray-400" />
              
              {isLangHovered && (
                <div className="absolute top-9.5 -left-10 w-60 bg-white border border-gray-300 shadow-2xl z-100 p-4 text-black animate-in fade-in duration-200 before:content-[''] before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white">
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold text-gray-500 uppercase">Change Language</p>
                    {["English - EN", "हिन्दी - HI"].map(l => (
                      <label key={l} className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" checked={l.includes("English")} readOnly className="accent-orange-500 w-4 h-4" />
                        <span className="text-[12px] font-bold group-hover:text-orange-600 transition-colors">{l}</span>
                      </label>
                    ))}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center gap-2 font-black text-[12px]">
                        <span>{activeConfig.flag}</span> <span>GearHunt {activeConfig.name}</span>
                      </div>
                      <Link href="/customer-preferences/country" className="block mt-2 text-blue-600 text-[11px] font-black hover:text-orange-600 hover:underline uppercase italic transition-colors tracking-tighter">Change country/region</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/auth/signin" className="flex flex-col p-2 leading-none border border-transparent hover:border-white transition-all shrink-0"><span className="text-[10px] text-gray-400 font-bold tracking-tighter">Hello, Sign in</span>Account & Lists</Link>
            <Link href="/cart" className="flex items-end gap-1 p-2 border border-transparent hover:border-white transition-all shrink-0 relative"><ShoppingCart size={34} /><span className="text-sm font-black">Cart</span></Link>
          </div>
        </div>
        
        {/* NAV TABS */}
        <div className="bg-[#232f3e] px-4 py-1.5 flex items-center gap-6 text-[11px] font-black uppercase shadow-md overflow-x-auto no-scrollbar tracking-widest">
          <button onClick={() => setIsSideMenuOpen(true)} className="flex items-center gap-1 shrink-0 hover:outline outline-1 p-1 px-2 border border-transparent transition-all"><Menu size={18}/> All</button>
          {GEARHUNT_CATEGORIES.slice(1).map(tab => (
            <Link key={tab} href="#" className={`whitespace-nowrap hover:outline outline-1 p-1 px-2 transition-all ${tab === 'Live TV' ? 'text-red-500 animate-pulse' : ''}`}>{tab}</Link>
          ))}
        </div>
      </nav>

      {/* STEP 3: HERO SLIDER (Resolved: Single transition & transition-all) */}
      <section className="relative w-full aspect-21/9 bg-black overflow-hidden group">
        <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent via-transparent to-[#eaeded]" />
        <div className="flex transition-transform duration-500 h-full ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {HERO_IMAGES.map((img, idx) => <img key={idx} src={img} className="w-full h-full object-cover opacity-80 shrink-0" alt="Banner" />)}
        </div>
        <button onClick={prevSlide} className="absolute left-0 top-0 bottom-32 z-20 w-20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:border-2 border-white focus:outline-none"><ChevronLeft size={60}/></button>
        <button onClick={nextSlide} className="absolute right-0 top-0 bottom-32 z-20 w-20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:border-2 border-white focus:outline-none"><ChevronRight size={60}/></button>
      </section>

      {/* STEP 4: GRID CARDS (Resolved: Single italic & tracking-tighter) */}
      <section className="max-w-375 mx-auto px-4 -mt-32 relative z-30 pb-20">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 shadow-sm min-h-20 flex flex-col group border-t-4 border-transparent hover:border-yellow-500 cursor-pointer transition-all">
                <h3 className="font-black uppercase text-xl italic tracking-tighter mb-4 leading-tight">Revamp your Universe</h3>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  {[1,2,3,4].map(item => (
                    <div key={item} className="bg-gray-100 flex flex-col p-2 group hover:bg-gray-200 transition-colors">
                      <div className="bg-gray-300 flex-1 min-h-20"></div>
                      <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter truncate italic">Gear Hub {item}</span>
                    </div>
                  ))}
                </div>
                <Link href="#" className="mt-4 text-blue-600 text-[10px] font-black hover:underline uppercase tracking-tighter italic transition-all">See more</Link>
            </div>
         </div>
      </section>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 35s linear infinite; }
      `}</style>
    </main>
  );
}