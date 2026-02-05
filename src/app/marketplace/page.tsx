/* eslint-disable */
// @ts-nocheck
"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ShoppingCart, MapPin, ChevronDown, Filter, Menu, User } from 'lucide-react';

// Marketplace ko vehicleDatabase ki zaroorat nahi hai, 
// kyunki data URL (searchParams) se aa raha hai.

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const model = searchParams.get('model');
  const brand = searchParams.get('brand');

  return (
    <main className="min-h-screen bg-[#eaeded] pb-10">
      <nav className="bg-[#131921] text-white sticky top-0 z-100">
        <div className="max-w-375 mx-auto flex items-center h-16 px-4 gap-4">
          <Link href="/" className="text-2xl font-black italic uppercase tracking-tighter shrink-0">
            GEAR<span className="text-yellow-500">HUNT</span>
          </Link>
          
          <div className="flex-1 flex h-10 rounded-md overflow-hidden bg-white mx-2">
            <input type="text" className="flex-1 px-4 text-black outline-none font-medium" placeholder={`Search gear for ${model || 'your machine'}...`}/>
            <button className="bg-[#febd69] px-6 text-black hover:bg-yellow-500 transition-all"><Search size={22}/></button>
          </div>

          <div className="flex items-center gap-6 font-black text-xs uppercase">
            <Link href="/cart" className="flex items-end gap-1">
               <ShoppingCart size={28}/>
               <span>Cart</span>
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-375 mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white p-4 shadow-sm border border-gray-200">
              <h3 className="font-black uppercase text-sm mb-4 flex items-center gap-2"><Filter size={16}/> Filters</h3>
              <p className="text-xs font-bold text-gray-400 uppercase">Model Locked: {model || 'None'}</p>
            </div>
          </aside>

          <div className="flex-1">
            <div className="bg-white p-4 mb-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-black italic uppercase">Results for: <span className="text-yellow-600">{model || brand || "Global Marketplace"}</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border border-gray-200 p-4 hover:shadow-xl transition-all flex flex-col">
                  <div className="aspect-square bg-gray-100 mb-4"></div>
                  <h4 className="font-black text-sm uppercase italic mb-1">Elite Performance Part #{i}</h4>
                  <div className="mt-auto">
                    <p className="text-2xl font-black italic">₹{2499 + i * 150}</p>
                    <button className="w-full bg-[#ffd814] mt-4 py-2 rounded-full font-bold text-sm">Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black italic text-4xl animate-pulse">GEARHUNT...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}