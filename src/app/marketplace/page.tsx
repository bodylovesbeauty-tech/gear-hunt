/* eslint-disable */
// @ts-nocheck
"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const model = searchParams.get('model');

  return (
    <div className="min-h-screen bg-white p-8">
      <header className="border-b-8 border-black pb-4 mb-12">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter">
          Gear for <span className="text-yellow-500">{model || "All Machines"}</span>
        </h1>
        <p className="text-xs font-black text-gray-400 mt-2 uppercase tracking-widest">Showing compatible accessories & parts</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Dummy Products logic for testing */}
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="group border-4 border-black p-4 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="h-48 bg-gray-100 mb-4 border-2 border-black"></div>
            <h3 className="font-black uppercase italic text-lg leading-none mb-2">High Performance Part {i}</h3>
            <p className="text-2xl font-black mb-4 italic">₹4,999</p>
            <button className="w-full bg-black text-white py-3 font-black uppercase italic hover:bg-yellow-500 hover:text-black transition-all">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div>Loading Universe...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}