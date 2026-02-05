/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, Filter, Settings, ShieldCheck } from 'lucide-react';

export default function CarBikeUniverse() {
  const [vehicle, setVehicle] = useState({ make: '', model: '', year: '' });

  return (
    <main className="min-h-screen bg-[#eaeded] font-sans">
      {/* HEADER (Already in layout or handled globally) */}
      <div className="bg-[#232f3e] text-white py-4 px-6 shadow-xl">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">
          CAR & BIKE <span className="text-yellow-500">UNIVERSE</span>
        </h1>
      </div>

      {/* --- THE IMPERIAL FIT FINDER (RESTORED & UPGRADED) --- */}
      <section className="max-w-7xl mx-auto mt-6 px-4">
        <div className="bg-white p-6 rounded-sm shadow-md border-b-4 border-yellow-500">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-yellow-600" size={24} />
            <h2 className="text-lg font-black uppercase tracking-widest">Find Parts for Your Vehicle</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select className="p-3 border font-bold text-sm bg-gray-50 outline-none focus:ring-2 ring-yellow-500">
              <option>Select Year</option>
              <option>2024</option>
              <option>2023</option>
            </select>
            <select className="p-3 border font-bold text-sm bg-gray-50 outline-none focus:ring-2 ring-yellow-500">
              <option>Select Make (Tata, BMW...)</option>
              <option>Tata</option>
              <option>Mahindra</option>
            </select>
            <select className="p-3 border font-bold text-sm bg-gray-50 outline-none focus:ring-2 ring-yellow-500">
              <option>Select Model</option>
            </select>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase py-3 transition-all shadow-lg">
              Check Fitment
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">
            *AI Verified Fitment for 1,00,000+ Indian Vehicles
          </p>
        </div>
      </section>

      {/* --- CAR & BIKE CATEGORIES --- */}
      <section className="max-w-7xl mx-auto mt-10 px-4 grid grid-cols-2 md:grid-cols-4 gap-6 pb-20">
        {[
          { name: "Engine Oils", img: "https://m.media-amazon.com/images/I/71Y8X-h5O9L._SX3000_.jpg" },
          { name: "Helmets", img: "https://m.media-amazon.com/images/I/71Y8X-h5O9L._SX3000_.jpg" },
          { name: "Car Lights", img: "https://m.media-amazon.com/images/I/71Y8X-h5O9L._SX3000_.jpg" },
          { name: "Bike Accessories", img: "https://m.media-amazon.com/images/I/71Y8X-h5O9L._SX3000_.jpg" }
        ].map((cat, i) => (
          <div key={i} className="bg-white p-4 border hover:shadow-2xl transition-all cursor-pointer group">
            <div className="h-40 bg-gray-100 mb-4 overflow-hidden">
                <img src={cat.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-black uppercase text-xs tracking-widest flex justify-between items-center">
              {cat.name} <ChevronRight size={14} className="text-yellow-600" />
            </h3>
          </div>
        ))}
      </section>
    </main>
  );
}