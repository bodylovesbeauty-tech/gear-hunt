"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useParams, useRouter } from 'next/navigation';

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  image_url: string;
  compatibility: string[];
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params || !params.id) return;
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (data) setProduct(data as Product);
      setLoading(false);
    };
    fetchProduct();
  }, [params]);

  const addToCart = async () => {
    setAdding(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please Sign In to shop!");
      router.push('/login');
      return;
    }

    if (product) {
      const { error } = await supabase
        .from('cart_items')
        .insert([
          { user_id: user.id, product_id: product.id, quantity: 1 }
        ]);

      if (error) {
        console.error(error);
        alert('Error adding to cart');
      } else {
        alert('✅ Added to Cart!');
      }
    }
    setAdding(false);
  };

  if (loading) return <div className="text-white text-center mt-20 text-sm">Loading...</div>;
  if (!product) return <div className="text-white text-center mt-20 text-sm">Product not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      
      <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-500 border-b border-gray-900">
        Marketplace &gt; {product.category} &gt; <span className="text-gray-300">{product.title}</span>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-8">
        
        {/* LEFT: Visuals */}
        <div className="space-y-4">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-800 relative">
            <img 
              src={product.image_url} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-800 rounded cursor-pointer hover:border-yellow-500 border border-transparent transition"></div>
            ))}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
            {product.title}
          </h1>
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">BESTSELLER</span>
             <span className="text-xs text-gray-400">4.8 Stars (120 Reviews)</span>
          </div>

          <div className="border-t border-b border-gray-800 py-4 my-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-medium text-white">₹{product.price}</span>
              <span className="text-sm text-green-500 font-bold">In Stock</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
          </div>

          <div className="flex flex-col gap-3 max-w-md">
            <button 
              onClick={addToCart}
              disabled={adding}
              className="w-full bg-yellow-500 text-black text-sm font-bold py-3 rounded-full hover:bg-yellow-400 transition flex justify-center items-center"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
            
            <button className="w-full bg-gray-800 text-white text-sm font-bold py-3 rounded-full hover:bg-gray-700 transition">
              Buy Now
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-bold text-white mb-2">About this item</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Upgrade your setup with premium quality gear. This {product.title} is designed for durability and performance.
              Verified fit for: {product.compatibility?.join(', ') || 'Universal Fit'}.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}