/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MarketplaceListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGear() {
      const { data, error } = await supabase
        .from('products') 
        .select('*');
      
      if (!error) setProducts(data);
      setLoading(false);
    }
    fetchGear();
  }, []);

  if (loading) return <div className="p-20 text-center font-black italic">GEARHUNT: LOADING INVENTORY...</div>;

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-end mb-12 border-b-4 border-black pb-4">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter">Marketplace</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pb-2">Step 18 Recovery Mode</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((item: any) => (
          <Link key={item.id} href={`/marketplace/${item.id}`}>
            <div className="group border-2 border-black p-0 hover:shadow-[10px_10px_0px_0px_rgba(234,179,8,1)] transition-all cursor-pointer">
              <div className="h-56 bg-gray-100 overflow-hidden border-b-2 border-black">
                <img 
                  src={item.image_url || 'https://via.placeholder.com/300'} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                />
              </div>
              <div className="p-4 bg-white">
                <p className="text-[9px] font-black text-yellow-600 uppercase mb-1">{item.category}</p>
                <h2 className="font-black uppercase text-lg italic leading-none mb-3">{item.name}</h2>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black italic">₹{item.price}</span>
                  <span className="text-[10px] font-black bg-black text-white px-2 py-1 uppercase italic">View Details</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}