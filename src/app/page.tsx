/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, ShoppingCart, MapPin, ChevronDown, Menu, X, User, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { vehicleDatabase } from '../lib/data/vehicleData';

const HERO_IMAGES = [
  "https://m.media-amazon.com/images/I/71Y8X-h5O9L._SX3000_.jpg",
  "https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg",
  "https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg"
];

const GEARHUNT_CATEGORIES = ["All", "Car & Bike", "Sports & Gym", "Home & Garden", "Safety Gear"];

export default function GearHuntMasterSovereign() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('India');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Garage Selection States
  const [garageCategory, setGarageCategory] = useState("2 Wheeler");
  const [garageBrand, setGarageBrand] = useState("");
  const [garageModel, setGarageModel] = useState("");

  const brands = vehicleDatabase[garageCategory]?.brands || [];
  const models = garageBrand ? vehicleDatabase[garageCategory][garageBrand] : [];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <main className="min-h-screen bg-[#eaeded] text-black font-sans overflow-x-hidden">
      {/* Ticker */}
      <div className="bg-[#febd69] h-8 flex items-center overflow-hidden border-b border-gray-300">
        <div className="flex animate-marquee whitespace-nowrap font-black uppercase text-[10px] italic tracking-widest">
            🏆 WORLD'S 1ST AI SOCIAL SHOPPING | FAST DELIVERY | GEARHUNT UNIVERSE EXPANSION LIVE
        </div>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#131921] text-white">
        <div className="max-w-375 mx-auto px-4 py-2 flex items-center gap-4">
          <Link href="/" className="text-2xl font-black italic uppercase text-white">GEAR<span className="text-yellow-500">HUNT</span></Link>
          <div onClick={() => setIsLocationModalOpen(true)} className="hidden lg:block cursor-pointer border border-transparent hover:border-white p-1">
            <p className="text-[10px] text-gray-400 font-bold leading-none italic">Deliver to</p>
            <p className="text-sm font-black flex items-center gap-1"><MapPin size={14} className="text-yellow-500"/> {currentLocation}</p>
          </div>
          <div className="flex-1 flex h-10 rounded overflow-hidden">
            <input type="text" placeholder="Search Gear..." className="flex-1 px-4 text-black font-bold outline-none" />
            <button className="bg-[#febd69] px-6 text-black hover:bg-yellow-500 transition-colors"><Search size={22} strokeWidth={3}/></button>
          </div>
          <div className="flex items-center gap-4 text-xs font-black uppercase">
            <Link href="/auth/signin">Hello, Sign in</Link>
            <Link href="/cart" className="flex items-end gap-1"><ShoppingCart size={30} /><span>Cart</span></Link>
          </div>
        </div>
        <div className="bg-[#232f3e] px-4 py-1.5 flex gap-6 text-[11px] font-black uppercase tracking-widest overflow-x-auto no-scrollbar">
          <button onClick={() => setIsSideMenuOpen(true)} className="flex items-center gap-1"><Menu size={18}/> All</button>
          {GEARHUNT_CATEGORIES.map(tab => <Link key={tab} href="#">{tab}</Link>)}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative w-full aspect-21/9 bg-black overflow-hidden group">
        <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent to-[#eaeded]" />
        <div className="flex transition-transform duration-500 h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {HERO_IMAGES.map((img, idx) => <img key={idx} src={img} className="w-full h-full object-cover opacity-80 shrink-0" alt="Banner" />)}
        </div>
        <button onClick={prevSlide} className="absolute left-0 top-0 bottom-32 z-20 w-20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"><ChevronLeft size={60}/></button>
        <button onClick={nextSlide} className="absolute right-0 top-0 bottom-32 z-20 w-20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"><ChevronRight size={60}/></button>
      </section>

      {/* Dashboard Grid */}
      <section className="max-w-375 mx-auto px-4 -mt-48 relative z-30 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card: Virtual Garage */}
          <div className="bg-white p-5 shadow-lg flex flex-col border-t-4 border-yellow-500">
            <h3 className="font-black uppercase text-xl italic tracking-tighter mb-4">Your Virtual Garage</h3>
            <div className="space-y-3 bg-gray-50 p-4 border-2 border-dashed border-gray-200">
              <select onChange={(e) => {setGarageCategory(e.target.value); setGarageBrand(""); setGarageModel("");}} className="w-full p-2 border-2 border-black font-black uppercase italic text-xs">
                <option value="2 Wheeler">2 Wheeler</option>
                <option value="4 Wheeler">4 Wheeler</option>
              </select>
              <select value={garageBrand} onChange={(e) => {setGarageBrand(e.target.value); setGarageModel("");}} className="w-full p-2 border-2 border-black font-black uppercase italic text-xs">
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              {garageBrand && (
                <select value={garageModel} onChange={(e) => setGarageModel(e.target.value)} className="w-full p-2 border-2 border-black font-black uppercase italic text-xs">
                  <option value="">Select Model</option>
                  {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                </select>
              )}
              <Link href={garageModel ? `/marketplace?model=${garageModel}` : '#'} className={`block text-center py-3 font-black uppercase italic text-sm ${garageModel ? 'bg-black text-white hover:bg-yellow-500' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                Explore Gear →
              </Link>
            </div>
          </div>

          {/* Card: Trending */}
          <div className="bg-white p-5 shadow-lg flex flex-col border-t-4 border-transparent hover:border-yellow-500 transition-all">
            <h3 className="font-black uppercase text-xl italic tracking-tighter mb-4">Today's Trending</h3>
            <div className="grid grid-cols-2 gap-2 flex-1"><div className="bg-gray-100 aspect-square"></div><div className="bg-gray-100 aspect-square"></div><div className="bg-gray-100 aspect-square"></div><div className="bg-gray-100 aspect-square"></div></div>
            <Link href="/marketplace" className="mt-4 text-blue-600 text-[10px] font-black uppercase italic">See More</Link>
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