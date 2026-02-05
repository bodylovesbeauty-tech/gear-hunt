"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 1. Define the shape of the data strictly
type ProductDetails = {
  title: string;
  price: number;
  image_url: string;
  category: string;
};

type CartItem = {
  id: number;
  quantity: number;
  products: ProductDetails | ProductDetails[]; 
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 2. Load the Cart
  useEffect(() => {
    const fetchCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select('id, quantity, products(title, price, image_url, category)')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cart:', error);
      }

      if (data) {
        setCartItems(data as unknown as CartItem[]);
      }
      setLoading(false);
    };

    fetchCart();
  }, [router]);

  // 3. Remove Item Function
  const removeItem = async (id: number) => {
    const { error } = await supabase.from('cart_items').delete().eq('id', id);
    if (!error) {
      setCartItems(cartItems.filter(item => item.id !== id));
    }
  };

  // 4. Helper to safely get product data
  const getProduct = (item: CartItem): ProductDetails => {
    if (Array.isArray(item.products)) {
      return item.products[0];
    }
    return item.products;
  };

  // 5. Calculate Total Price
  const total = cartItems.reduce((sum, item) => {
    const product = getProduct(item);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  if (loading) return <div className="text-white text-center mt-20">Loading Cart...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Shopping Cart ({cartItems.length})</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Your Cart is Empty</h2>
          <Link href="/marketplace" className="bg-yellow-500 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-400">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = getProduct(item);
              if (!product) return null;

              return (
                <div key={item.id} className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex gap-4">
                  {/* Image - FIXED: Changed flex-shrink-0 to shrink-0 */}
                  <div className="w-24 h-24 bg-gray-800 rounded overflow-hidden shrink-0">
                     <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base md:text-lg line-clamp-1">{product.title}</h3>
                      <p className="text-gray-500 text-xs uppercase font-bold">{product.category}</p>
                      <p className="text-green-500 text-xs mt-1">In Stock</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-500 hover:text-red-400 font-medium"
                      >
                        Delete
                      </button>
                      <div className="text-xl font-bold text-yellow-500">₹{product.price}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Checkout Summary */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 h-fit sticky top-24">
            <div className="flex justify-between items-center mb-2 text-gray-400">
              <span>Subtotal ({cartItems.length} items):</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-xl font-bold text-white">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>

            <button className="w-full bg-yellow-500 text-black font-bold py-3 rounded-full hover:bg-yellow-400 transition mb-4 shadow-lg shadow-yellow-500/20">
              Proceed to Buy
            </button>
            
            <div className="text-center text-xs text-gray-500 mt-4 border-t border-gray-800 pt-4">
              <p className="mb-2">Secure Transaction</p>
              <div className="flex justify-center gap-3 opacity-50 text-xl grayscale">
                <span>💳</span><span>🏦</span><span>📱</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}