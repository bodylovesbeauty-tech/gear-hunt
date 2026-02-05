/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, ShoppingCart, MapPin, ChevronDown, Menu, X, User, ChevronLeft, ChevronRight, Globe 
} from 'lucide-react';

// --- VEHICLE ENGINE IMPORT ---
import { vehicleDatabase } from '../lib/data/vehicleData';

// --- DATA LOCKS ---
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
  // --- CORE UI STATES ---
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

  // --- NEW GARAGE STATES ---
  const [garageCategory, setGarageCategory] = useState("2 Wheeler");
  const [garageBrand, setGarageBrand] = useState("");
  const [garageModel, setGarageModel] = useState("");

  const activeConfig = COUNTRY_CONFIGS[countryCode];
  const brands = vehicleDatabase[garageCategory]?.brands || [];
  const models = garageBrand ? vehicleDatabase[garageCategory][garageBrand] : [];

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
      
      {/* SIDE MENU - Fix: z-200 */}
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
            </div>
            <button onClick={() => setIsSideMenuOpen(false)} className="absolute top-2 -right-12 text-white hover:rotate-90 transition-transform"><X size={36} /></button>
          </div>
        </div>
      )}

      {/* LOCATION POPUP - Fix: z-100 & max-w-100 */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-100 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-100 rounded-lg shadow-2xl animate-in fade-in duration-200 overflow-hidden">
            <div className="bg-gray-100 p-4 flex justify-between items-center border-b">
              <h2 className="font-black uppercase text-sm italic">Choose your location</h2>
              <button onClick={() => setIsLocationModalOpen(false)}><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" value={pincode} 
                  onChange={(e) => setPincode(e.target.value)} 
                  className="flex-1 border-2 border-gray-300 p-2 rounded text-sm font-bold outline-none" 
                  placeholder={`Enter ${activeConfig.label}`} 
                />
                <button onClick={() => { if(pincode) { setCurrentLocation(pincode); setIsLocationModalOpen(false); } }} className="bg-yellow-400 px-6 py-2 rounded font-black text-xs uppercase shadow-md">Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#febd69] h-8 flex items-center border-b border-gray-300 overflow-hidden relative z-50">
        <div className="flex animate-marquee whitespace-nowrap font-black uppercase text-[10px] tracking-widest italic">
            🏆 World's 1st AI Social Shopping for Gear Enthusiasts | 🚚 Fast Delivery to {activeConfig.name}
        </div>
      </div>

      {/* NAVBAR - Fix: max-w-375 */}
      <nav className="sticky top-0 z-50 bg-[#131921] text-white">
        <div className="max-w-375 mx-auto px-4 py-2 flex items-center gap-2">
          <Link href="/" className="text-2xl font-black italic uppercase tracking-tighter shrink-0">
            GEAR<span className="text-yellow-500">HUNT</span>
          </Link>
          
          <div onClick={() => setIsLocationModalOpen(true)} className="hidden lg:flex flex-col border border-transparent hover:border-white p-1 px-2 cursor-pointer font-black transition-all">
            <span className="text-[10px] text-gray-400 leading-none italic">Deliver to</span>
            <div className="flex items-center gap-1 text-sm"><MapPin size={14} className="text-yellow-500"/> {currentLocation}</div>
          </div>

          <div className="flex-1 flex h-10 rounded-md bg-white mx-2 overflow-hidden">
            <button className="bg-gray-100 px-4 h-full text-[11px] font-black text-gray-600 border-r uppercase flex items-center gap-1">{selectedCategory} <ChevronDown size={12}/></button>
            <input type="text" placeholder={`Search in ${selectedCategory}...`} className="flex-1 px-4 text-black text-sm outline-none font-bold" />
            <button className="bg-[#febd69] px-6 text-black hover:bg-yellow-500 transition-colors"><Search size={22} strokeWidth={3}/></button>
          </div>

          <div className="flex items-center gap-4 text-xs font-black uppercase shrink-0">
            <Link href="/auth/signin" className="flex flex-col leading-none border border-transparent hover:border-white p-2">
              <span className="text-[10px] text-gray-400 font-bold">Hello, Sign in</span>Account & Lists
            </Link>
            <Link href="/cart" className="flex items-end gap-1 p-2 border border-transparent hover:border-white relative"><ShoppingCart size={34} /><span className="text-sm font-black">Cart</span></Link>
          </div>
        </div>
        <div className="bg-[#232f3e] px-4 py-1.5 flex items-center gap-6 text-[11px] font-black uppercase tracking-widest overflow-x-auto no-scrollbar">
          <button onClick={() => setIsSideMenuOpen(true)} className="flex items-center gap-1 shrink-0"><Menu size={18}/> All</button>
          {GEARHUNT_CATEGORIES.slice(1).map(tab => <Link key={tab} href="#" className="whitespace-nowrap">{tab}</Link>)}
        </div>
      </nav>

      {/* HERO SLIDER - Fix: aspect-21/9 and bg-linear-to-b */}
      <section className="relative w-full aspect-21/9 bg-black overflow-hidden group">
        <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent to-[#eaeded]" />
        <div className="flex transition-transform duration-500 h-full ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {HERO_IMAGES.map((img, idx) => <img key={idx} src={img} className="w-full h-full object-cover opacity-80 shrink-0" alt="Banner" />)}
        </div>
        <button onClick={prevSlide} className="absolute left-0 top-0 bottom-32 z-20 w-20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all focus:outline-none"><ChevronLeft size={60}/></button>
        <button onClick={nextSlide} className="absolute right-0 top-0 bottom-32 z-20 w-20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all focus:outline-none"><ChevronRight size={60}/></button>
      </section>

      {/* GRID CARDS - Fix: max-w-375 */}
      <section className="max-w-375 mx-auto px-4 -mt-48 relative z-30 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 shadow-lg flex flex-col border-t-4 border-yellow-500">
            <h3 className="font-black uppercase text-xl italic tracking-tighter mb-4 leading-tight">Your Virtual Garage</h3>
            <div className="flex-1 space-y-3 bg-gray-50 p-4 border-2 border-dashed border-gray-200">
              <select 
                value={garageCategory} 
                onChange={(e) => {setGarageCategory(e.target.value); setGarageBrand(""); setGarageModel("");}}
                className="w-full p-2 border-2 border-black font-black uppercase italic text-xs outline-none bg-white"
              >
                <option value="2 Wheeler">2 Wheeler</option>
                <option value="4 Wheeler">4 Wheeler</option>
              </select>

              <select 
                value={garageBrand} 
                onChange={(e) => {setGarageBrand(e.target.value); setGarageModel("");}}
                className="w-full p-2 border-2 border-black font-black uppercase italic text-xs outline-none bg-white"
              >
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>

              {garageBrand && (
                <select 
                  value={garageModel} 
                  onChange={(e) => setGarageModel(e.target.value)}
                  className="w-full p-2 border-2 border-black font-black uppercase italic text-xs outline-none bg-white"
                >
                  <option value="">Select Model</option>
                  {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                </select>
              )}

              <Link 
                href={garageModel ? `/marketplace?model=${garageModel}` : '#'}
                className={`block text-center py-3 font-black uppercase italic text-sm transition-all ${garageModel ? 'bg-black text-white hover:bg-yellow-500 hover:text-black shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Find Compatible Gear →
              </Link>
            </div>
          </div>

          <div className="bg-white p-5 shadow-lg flex flex-col border-t-4 border-transparent hover:border-yellow-500 transition-all cursor-pointer">
            <h3 className="font-black uppercase text-xl italic tracking-tighter mb-4 leading-tight">Trending Universes</h3>
            <div className="grid grid-cols-2 gap-2 flex-1">
              {[1,2,3,4].map(i => <div key={i} className="bg-gray-100 aspect-square border-2 border-transparent hover:border-black transition-all"></div>)}
            </div>
            <Link href="/marketplace" className="mt-4 text-blue-600 text-[10px] font-black uppercase italic hover:underline">See more</Link>
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