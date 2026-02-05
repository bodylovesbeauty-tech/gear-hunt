/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, ShoppingCart, MapPin, ChevronDown, Menu, X, User, ChevronLeft, ChevronRight, Globe 
} from 'lucide-react';
import { vehicleDatabase } from '../lib/data/vehicleData';

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
  US: { name: "United States", flag: "🇺🇸", label: "US Zip Code" }
};

export default function GearHuntMasterSovereign() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isSearchCategoryOpen, setIsSearchCategoryOpen] = useState(false);
  const [isLangHovered, setIsLangHovered] = useState(false); 
  const [currentLocation, setCurrentLocation] = useState('India');
  const [pincode, setPincode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Garage States
  const [garageCategory, setGarageCategory] = useState("2 Wheeler");
  const [garageBrand, setGarageBrand] = useState("");
  const [garageModel, setGarageModel] = useState("");

  const brands = vehicleDatabase[garageCategory]?.brands || [];
  const models = garageBrand ? vehicleDatabase[garageCategory][garageBrand] : [];
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#eaeded] text-black relative font-sans selection:bg-yellow-500/30 overflow-x-hidden">
      
      {/* SIDE MENU */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-[200] flex animate-in fade-in duration-300">
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
            <button onClick={() => setIsSideMenuOpen(false)} className="absolute top-2 -right-12 text-white"><X size={36} /></button>
          </div>
        </div>
      )}

      {/* LOCATION MODAL */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl border animate-in fade-in duration-200">
            <div className="bg-gray-100 p-4 flex justify-between items-center border-b">
              <h2 className="font-black uppercase text-sm italic">Choose your location</h2>
              <button onClick={() => setIsLocationModalOpen(false)}><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} className="flex-1 border-2 border-gray-300 p-2 rounded text-sm font-bold outline-orange-500" placeholder="Enter pincode" />
                <button onClick={() => { if(pincode) { setCurrentLocation(pincode); setIsLocationModalOpen(false); } }} className="bg-yellow-400 border border-yellow-500 px-6 py-2 rounded font-black text-xs uppercase">Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TICKER */}
      <div className="bg-[#febd69] h-8 flex items-center border-b border-gray-300 overflow-hidden relative z-50">
        <div className="flex animate-marquee whitespace-nowrap font-black uppercase text-[10px] tracking-widest italic">
            🏆 World's 1st AI Social Shopping | 🚚 Fast Delivery | ✨ GearHunt Universe Expansion Live
        </div>
      </div>

      {/* MAIN NAV */}
      <nav className="sticky top-0 z-50 bg-[#131921] text-white">
        <div className="max-w-[1500px] mx-auto px-4 py-2 flex items-center gap-2">
          <Link href="/" className="text-2xl font-black italic uppercase tracking-tighter shrink-0">
            GEAR<span className="text-yellow-500">HUNT</span>
          </Link>
          
          <div onClick={() => setIsLocationModalOpen(true)} className="hidden lg:flex flex-col border border-transparent hover:border-white p-1 px-2 cursor-pointer font-black uppercase shrink-0">
            <span className="text-[10px] text-gray-400 leading-none italic">Deliver to</span>
            <div className="flex items-center gap-1 text-sm"><MapPin size={14} className="text-yellow-500"/> {currentLocation}</div>
          </div>

          <div className="flex-1 flex h-10 rounded-md bg-white mx-2 focus-within:ring-2 ring-yellow-500 relative">
            <button onClick={() => setIsSearchCategoryOpen(!isSearchCategoryOpen)} className="bg-gray-100 px-4 h-full text-[11px] font-black text-gray-600 border-r uppercase flex items-center gap-1 hover:bg-gray-200 transition-colors tracking-tighter">{selectedCategory} <ChevronDown size={12}/></button>
            <input type="text" placeholder={`Search Gear...`} className="flex-1 px-4 text-black text-sm outline-none font-bold" />
            <button className="bg-[#febd69] px-6 text-black hover:bg-yellow-500 transition-colors"><Search size={22} strokeWidth={3}/></button>
          </div>

          <div className="flex items-center gap-4 text-xs font-black uppercase shrink-0">
            <div onMouseEnter={() => setIsLangHovered(true)} onMouseLeave={() => setIsLangHovered(false)} className="relative py-2 flex items-center gap-1 border border-transparent hover:border-white p-2 cursor-pointer">
              <span className="text-lg">🇮🇳</span> <span className="text-[12px]">EN</span> <ChevronDown size={10} />
              {isLangHovered && (
                <div className="absolute top-9 left-0 w-48 bg-white border border-gray-300 shadow-2xl z-[100] p-4 text-black animate-in fade-in">
                  <p className="text-[11px] font-bold text-gray-500 mb-2">Change Language</p>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked readOnly className="accent-orange-500" /><span className="text-xs font-bold">English - EN</span></label>
                </div>
              )}
            </div>
            <Link href="/auth/signin" className="flex flex-col p-2 leading-none border border-transparent hover:border-white transition-all shrink-0"><span className="text-[10px] text-gray-400 font-bold">Hello, Sign in</span>Account & Lists</Link>
            <Link href="/cart" className="flex items-end gap-1 p-2 border border-transparent hover:border-white transition-all shrink-0"><ShoppingCart size={32} /><span className="text-sm font-black">Cart</span></Link>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-[#232f3e] px-4 py-1.5 flex items-center gap-6 text-[11px] font-black uppercase shadow-md overflow-x-auto no-scrollbar tracking-widest">
          <button onClick={() => setIsSideMenuOpen(true)} className="flex items-center gap-1 shrink-0 hover:outline outline-1 p-1 px-2 border border-transparent transition-all"><Menu size={18}/> All</button>
          {GEARHUNT_CATEGORIES.slice(1).map(tab => <Link key={tab} href="#" className="whitespace-nowrap hover:outline outline-1 p-1 px-2">{tab}</Link>)}
        </div>
      </nav>

      {/* HERO SLIDER */}
      <section className="relative w-full aspect-[21/9] bg-black overflow-hidden group">
        <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent via-transparent to-[#eaeded]" />
        <div className="flex transition-transform duration-700 h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {HERO_IMAGES.map((img, idx) => (
            <img key={idx} src={img} className="w-full h-full object-cover opacity-80 shrink-0" alt="Banner" />
          ))}
        </div>
        <button onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)} className="absolute left-0 top-0 bottom-32 z-20 w-20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100"><ChevronLeft size={60}/></button>
        <button onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)} className="absolute right-0 top-0 bottom-32 z-20 w-20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100"><ChevronRight size={60}/></button>
      </section>

      {/* DASHBOARD GRID */}
      <section className="max-w-[1500px] mx-auto px-4 -mt-32 md:-mt-64 relative z-40 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* VIRTUAL GARAGE CARD */}
          <div className="bg-white p-5 shadow-lg border-t-4 border-yellow-500 flex flex-col">
            <h3 className="text-xl font-black uppercase italic mb-4 tracking-tighter">Your Virtual Garage</h3>
            <div className="space-y-4 bg-gray-50 p-4 border-2 border-dashed border-gray-200 rounded-lg">
              <select onChange={(e) => {setGarageCategory(e.target.value); setGarageBrand("");}} className="w-full p-2 border-2 border-black font-black uppercase italic text-xs outline-none">
                <option value="2 Wheeler">2 Wheeler</option>
                <option value="4 Wheeler">4 Wheeler</option>
              </select>
              <select value={garageBrand} onChange={(e) => setGarageBrand(e.target.value)} className="w-full p-2 border-2 border-black font-black uppercase italic text-xs outline-none">
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              {garageBrand && (
                <select value={garageModel} onChange={(e) => setGarageModel(e.target.value)} className="w-full p-2 border-2 border-black font-black uppercase italic text-xs outline-none">
                  <option value="">Select Model</option>
                  {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                </select>
              )}
              <Link href={garageModel ? `/marketplace?model=${garageModel}` : '#'} className={`block text-center py-3 font-black uppercase italic text-sm ${garageModel ? 'bg-black text-white hover:bg-yellow-500 hover:text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} transition-all`}>
                Enter Universe →
              </Link>
            </div>
          </div>

          {/* TRENDING CARDS */}
          <div className="bg-white p-5 shadow-lg">
            <h3 className="text-xl font-black uppercase italic mb-4 tracking-tighter">Safety Gear</h3>
            <div className="grid grid-cols-2 gap-2">
              {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-100 hover:scale-105 transition-all cursor-pointer border border-gray-200"></div>)}
            </div>
            <Link href="#" className="mt-4 block text-blue-600 text-xs font-black uppercase italic hover:underline">Explore More</Link>
          </div>

          <div className="bg-white p-5 shadow-lg">
            <h3 className="text-xl font-black uppercase italic mb-4 tracking-tighter">Performance Parts</h3>
            <div className="aspect-square bg-gray-100 mb-4 border border-gray-200"></div>
            <Link href="#" className="text-blue-600 text-xs font-black uppercase italic hover:underline">Shop Performance</Link>
          </div>

          <div className="bg-white p-5 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black uppercase italic mb-4 tracking-tighter">Join The Community</h3>
              <p className="text-sm font-bold mb-4">Connect with fellow enthusiasts and share your builds.</p>
              <Link href="/auth/signin" className="block w-full bg-yellow-400 py-2 text-center text-xs font-black uppercase border border-yellow-500 shadow-sm">Sign in securely</Link>
            </div>
            <div className="mt-4 pt-4 border-t flex gap-2">
              <div className="w-10 h-10 rounded-full bg-yellow-500"></div>
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            </div>
          </div>

        </div>
      </section>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 35s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}