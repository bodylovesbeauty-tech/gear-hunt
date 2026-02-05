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

export default function GearHuntMasterSovereign() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isSearchCategoryOpen, setIsSearchCategoryOpen] = useState(false);
  const [isLangHovered, setIsLangHovered] = useState(false); 
  const [currentLocation, setCurrentLocation] = useState('India');
  const [pincode, setPincode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  
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
    <main className="min-h-screen bg-[#eaeded] text-black relative font-sans overflow-x-hidden">
      
      {/* SIDE MENU - Fixed z-200 */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-200 flex">
          <div className="fixed inset-0 bg-black/80" onClick={() => setIsSideMenuOpen(false)}></div>
          <div className="relative w-80 bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <Link href="/auth/signin" className="bg-[#232f3e] p-4 text-white flex items-center gap-3">
              <User size={28} className="bg-white/20 rounded-full p-1" />
              <span className="text-lg font-black italic">Hello, Sign in</span>
            </Link>
            <div className="p-4 space-y-6 overflow-y-auto">
              <h3 className="text-sm font-black uppercase text-gray-800 italic">Gear Universes</h3>
              {GEARHUNT_CATEGORIES.slice(1).map(cat => (
                <Link key={cat} href="#" className="block p-2 text-sm font-bold hover:bg-gray-100">{cat}</Link>
              ))}
            </div>
            <button onClick={() => setIsSideMenuOpen(false)} className="absolute top-2 -right-12 text-white"><X size={36} /></button>
          </div>
        </div>
      )}

      {/* TICKER */}
      <div className="bg-[#febd69] h-8 flex items-center border-b border-gray-300 overflow-hidden relative z-50">
        <div className="flex animate-marquee whitespace-nowrap font-black uppercase text-[10px] tracking-widest italic">
            🏆 World's 1st AI Social Shopping for Gear Enthusiasts | 🚚 Fast Delivery | ✨ GearHunt Universe Expansion Live
        </div>
      </div>

      {/* MAIN NAV - Fixed max-w-360 (V4 Wide) */}
      <nav className="sticky top-0 z-50 bg-[#131921] text-white">
        <div className="max-w-360 mx-auto px-4 py-2 flex items-center gap-4">
          <Link href="/" className="text-2xl font-black italic uppercase tracking-tighter shrink-0">
            GEAR<span className="text-yellow-500">HUNT</span>
          </Link>
          
          <div onClick={() => setIsLocationModalOpen(true)} className="hidden lg:flex flex-col border border-transparent hover:border-white p-1 px-2 cursor-pointer shrink-0">
            <span className="text-[11px] text-gray-400 font-bold italic">Deliver to</span>
            <div className="flex items-center gap-1 text-sm font-black italic"><MapPin size={14} className="text-yellow-500"/> {currentLocation}</div>
          </div>

          <div className="flex-1 flex h-10 rounded-md bg-white overflow-hidden focus-within:ring-2 ring-yellow-500">
             <button className="bg-gray-100 px-3 text-[11px] font-black text-gray-600 border-r uppercase flex items-center gap-1">All <ChevronDown size={14}/></button>
             <input type="text" placeholder="Search GearHunt..." className="flex-1 px-4 text-black text-sm outline-none font-medium" />
             <button className="bg-[#febd69] px-5 text-black hover:bg-yellow-500 transition-colors"><Search size={22} strokeWidth={3}/></button>
          </div>

          <div className="flex items-center gap-4 text-xs font-black uppercase">
            <Link href="/auth/signin" className="border border-transparent hover:border-white p-2 flex flex-col leading-none">
              <span className="text-[10px] text-gray-400 font-bold">Hello, Sign in</span> Account & Lists
            </Link>
            <Link href="/cart" className="flex items-end gap-1 p-2 border border-transparent hover:border-white relative">
              <ShoppingCart size={32} />
              <span className="text-sm font-black">Cart</span>
            </Link>
          </div>
        </div>

        <div className="bg-[#232f3e] px-4 py-2 flex items-center gap-6 text-[12px] font-black uppercase overflow-x-auto no-scrollbar">
          <button onClick={() => setIsSideMenuOpen(true)} className="flex items-center gap-1"><Menu size={18}/> All</button>
          {GEARHUNT_CATEGORIES.slice(1, 8).map(tab => <Link key={tab} href="#" className="whitespace-nowrap">{tab}</Link>)}
        </div>
      </nav>

      {/* HERO SLIDER - Fixed h-150 & linear-to-b */}
      <section className="relative w-full h-150 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#eaeded] z-10" />
        <div className="flex h-full transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {HERO_IMAGES.map((img, idx) => (
            <img key={idx} src={img} className="w-full h-full object-cover shrink-0 opacity-90" alt="Banner" />
          ))}
        </div>
        <button onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white p-2 hover:border border-white transition-all"><ChevronLeft size={60}/></button>
        <button onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white p-2 hover:border border-white transition-all"><ChevronRight size={60}/></button>
      </section>

      {/* CONTENT GRID - Fixed max-w-360 */}
      <section className="max-w-360 mx-auto px-4 -mt-48 relative z-30 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* VIRTUAL GARAGE */}
          <div className="bg-white p-5 shadow-lg border-t-4 border-yellow-500 flex flex-col">
            <h3 className="text-xl font-black uppercase italic mb-4 tracking-tighter leading-tight">Your Virtual Garage</h3>
            <div className="space-y-4 bg-gray-50 p-4 border border-gray-200 rounded">
              <p className="text-[11px] font-bold text-gray-500 uppercase italic">Select your machine to unlock the universe</p>
              <select onChange={(e) => {setGarageCategory(e.target.value); setGarageBrand("");}} className="w-full p-2 border-2 border-gray-200 font-black uppercase text-xs outline-none focus:border-yellow-500">
                <option value="2 Wheeler">2 Wheeler</option>
                <option value="4 Wheeler">4 Wheeler</option>
              </select>
              <select value={garageBrand} onChange={(e) => setGarageBrand(e.target.value)} className="w-full p-2 border-2 border-gray-200 font-black uppercase text-xs outline-none focus:border-yellow-500">
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <Link href={garageBrand ? `/marketplace?brand=${garageBrand}` : '#'} className={`block text-center py-3 font-black uppercase italic text-sm transition-all ${garageBrand ? 'bg-black text-white hover:bg-yellow-500 hover:text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                Enter Universe →
              </Link>
            </div>
          </div>

          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-5 shadow-lg flex flex-col">
              <h3 className="text-xl font-black uppercase italic mb-4 tracking-tighter">Universe Hub {i}</h3>
              <div className="grid grid-cols-2 gap-2 flex-1">
                {[1,2,3,4].map(j => <div key={j} className="aspect-square bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors"></div>)}
              </div>
              <Link href="#" className="mt-4 block text-blue-600 text-xs font-black uppercase italic hover:underline">See more</Link>
            </div>
          ))}

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