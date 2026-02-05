/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setProduct(data);
      setLoading(false);
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-black italic">GEARHUNT: LOADING SPECIFICATIONS...</div>;
  if (!product) return <div className="p-20 text-center font-black italic underline decoration-red-500">PRODUCT NOT FOUND</div>;

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      <button onClick={() => router.back()} className="mb-8 font-black uppercase text-xs italic border-b-2 border-black pb-1 hover:text-yellow-500 transition-colors">
        ← Back to Marketplace
      </button>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1 border-4 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
          <img src={product.image_url} alt={product.name} className="w-full h-auto" />
        </div>
        
        <div className="flex-1 space-y-6">
          <span className="bg-yellow-500 text-black px-3 py-1 text-[10px] font-black uppercase italic">{product.category}</span>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">{product.name}</h1>
          <p className="text-3xl font-black italic">₹{product.price}</p>
          
          <div className="border-t-2 border-black pt-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-2">Description</h3>
            <p className="text-sm font-bold text-gray-600 leading-relaxed uppercase">
              {product.description || "High-performance gear engineered for the ultimate riding experience. Built to last, designed to win."}
            </p>
          </div>

          <button className="w-full bg-black text-white py-5 font-black uppercase italic text-xl hover:bg-yellow-500 hover:text-black transition-all">
            Add to Battle Station (Cart)
          </button>
        </div>
      </div>
    </div>
  );
}