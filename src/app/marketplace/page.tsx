/* eslint-disable */
// @ts-nocheck
"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ShoppingCart, MapPin, ChevronDown, Filter } from 'lucide-react';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const model = searchParams.get('model');
  const brand = searchParams.get('brand');

  return (
    <main className="min-h-screen bg-[#eaeded] pb-10">
      {/* 1. TOP NAV (Matching Home) */}
      <nav className="bg-[#131921] text-white sticky top-0 z-100">
        <div className="max-w-375 mx-auto flex items-center h-16 px-4 gap-4">
          <Link href="/" className="text-2xl font-black italic uppercase tracking-tighter shrink-0">
            GEAR<span className="text-yellow-500">HUNT</span>
          </Link>
          
          <div className="hidden md:flex items-center p-2">
            <MapPin size={18} className="text-white mt-2" />
            <div className="ml-1 leading-tight">
              <p className="text-[12px] text-gray-400 font-bold">Deliver to</p>
              <p className="text-sm font-black italic">India</p>
            </div>
          </div>

          <div className="flex-1 flex h-10 rounded-md overflow-hidden bg-white">
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

      {/* 2. CATEGORY BAR */}
      <div className="bg-[#232f3e] text-white px-4 py-2 flex gap-6 text-xs font-bold uppercase tracking-widest overflow-x-auto no-scrollbar">
          <span className="text-yellow-500">All Results</span>
          <span>Helmets</span>
          <span>Performance</span>
          <span>Security</span>
          <span>Maintenance</span>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <section className="max-w-375 mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* LEFT FILTER SIDEBAR */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white p-4 shadow-sm border border-gray-200">
              <h3 className="font-black uppercase text-sm mb-4 flex items-center gap-2">
                <Filter size={16}/> Filters
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-black uppercase text-gray-500 mb-2">Category</p>
                  <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox"/> Premium Gear</label>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs font-black uppercase text-gray-500 mb-2">Price Range</p>
                  <p className="text-sm font-bold">Under ₹5,000</p>
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div className="flex-1">
            <div className="bg-white p-4 mb-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-black italic uppercase">
                Results for: <span className="text-yellow-600">{model || brand || "All Machines"}</span>
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">1,240+ Compatible Items Found</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border border-gray-200 p-4 hover:shadow-xl transition-all group flex flex-col">
                  <div className="aspect-square bg-gray-100 mb-4 overflow-hidden relative">
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase italic">Best Seller</div>
                  </div>
                  <h4 className="font-black text-sm uppercase italic mb-1 group-hover:text-blue-600 cursor-pointer">
                    GearHunt Elite Series Performance Part #{i}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold mb-2">★★★★★ 482 Reviews</p>
                  <div className="mt-auto">
                    <p className="text-2xl font-black italic">₹{4999 + i * 100}</p>
                    <p className="text-[10px] text-green-600 font-black mb-4">FREE Delivery by GearHunt</p>
                    <button className="w-full bg-[#ffd814] hover:bg-[#f7ca00] py-2 rounded-full font-bold text-sm shadow-sm transition-all border border-[#fcd200]">
                      Add to Cart
                    </button>
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-black italic text-4xl animate-pulse uppercase tracking-tighter">
        Syncing Universe...
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}