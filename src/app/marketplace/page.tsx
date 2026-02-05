"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link'; 

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  image_url: string;
};

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Compact Header */}
      <div className="max-w-screen-2xl mx-auto px-4 py-6 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Marketplace <span className="text-gray-500 text-sm font-normal ml-2">({products.length} Items)</span>
        </h1>
        <button className="bg-gray-800 px-3 py-1 rounded text-xs font-bold hover:bg-gray-700">
          Filter
        </button>
      </div>

      {/* THE COMPACT GRID */}
      {/* Mobile: grid-cols-2 (Two items side by side like Amazon App) */}
      {/* Desktop: grid-cols-5 (High density professional look) */}
      <div className="max-w-screen-2xl mx-auto px-2 md:px-4 mt-4">
        {loading ? (
          <div className="text-center text-gray-500 text-sm mt-10">Loading Inventory...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
            {products.map((product) => (
              <Link 
                href={`/marketplace/${product.id}`} 
                key={product.id} 
                className="block group bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 hover:border-yellow-500/50 transition"
              >
                
                {/* Image - Adjusted aspect ratio */}
                <div className="aspect-[4/3] bg-gray-800 relative overflow-hidden">
                  <img 
                    src={product.image_url} 
                    alt={product.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-1 right-1 bg-black/70 px-1.5 py-0.5 text-[10px] rounded text-white backdrop-blur-sm">
                    {product.category}
                  </div>
                </div>

                {/* Info - Compact Text */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-200 line-clamp-2 h-10 leading-snug">
                    {product.title}
                  </h3>
                  <div className="flex flex-col mt-2">
                    <span className="text-yellow-500 font-bold text-lg">₹{product.price}</span>
                    <span className="text-[10px] text-green-500">In Stock</span>
                  </div>
                </div>
                
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}