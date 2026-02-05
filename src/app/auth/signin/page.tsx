/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function GearHuntSovereignSignIn() {
  const [authInput, setAuthInput] = useState('');

  return (
    <main className="min-h-screen bg-white font-sans text-black flex flex-col items-center pt-8 pb-20 px-4">
      {/* IMPERIAL LOGO */}
      <Link href="/" className="text-3xl font-black italic uppercase mb-6 tracking-tighter">
        Gear<span className="text-yellow-500">Hunt.</span><span className="text-xs lowercase text-gray-500 font-bold">.in</span>
      </Link>

      {/* SIGN-IN BOX (Using Optimized w-87.5) */}
      <div className="w-87.5 p-6 border border-gray-300 rounded-md shadow-sm">
        <h1 className="text-2xl font-bold mb-4 tracking-tight">Sign in</h1>
        
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-black mb-1">Email or mobile phone number</label>
            <input 
              type="text" 
              value={authInput}
              onChange={(e) => setAuthInput(e.target.value)}
              className="w-full border border-gray-400 p-2 rounded-sm text-sm focus:border-orange-500 focus:ring-1 ring-orange-500 outline-none shadow-inner transition-all"
              placeholder="Enter email or mobile number"
            />
          </div>

          <button className="w-full bg-linear-to-b from-yellow-300 to-yellow-500 hover:from-yellow-400 py-2 rounded-md font-black text-xs shadow-md text-black border border-gray-400 transition-all active:scale-95">
            Continue
          </button>

          <p className="text-[10px] text-gray-600 leading-tight">
            By continuing, you agree to GearHunt's <span className="text-blue-600 hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Notice</span>.
          </p>
        </form>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <h4 className="text-[11px] font-black mb-2 uppercase tracking-widest text-gray-800">Buying for work?</h4>
          <Link href="/seller" className="text-blue-600 text-xs font-bold hover:underline">Shop on GearHunt Business</Link>
        </div>
      </div>

      {/* NEW TO GEARHUNT DIVIDER (Using h-px) */}
      <div className="w-87.5 mt-8 flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest whitespace-nowrap">New to GearHunt?</span>
          <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <Link href="/auth/signup" className="w-87.5 mt-4 py-2 border border-gray-300 rounded-md text-center text-xs font-black hover:bg-gray-50 shadow-sm transition-all bg-linear-to-b from-white to-gray-50">
        Create your GearHunt account
      </Link>

      {/* IMPERIAL AUTH FOOTER */}
      <footer className="mt-10 pt-10 border-t border-gray-200 w-full max-w-sm text-center">
         <div className="flex justify-center gap-6 text-[10px] font-bold text-blue-600 mb-4 uppercase tracking-tighter">
           <span className="hover:underline cursor-pointer">Conditions of Use</span>
           <span className="hover:underline cursor-pointer">Privacy Notice</span>
           <span className="hover:underline cursor-pointer">Help</span>
         </div>
         <p className="text-[9px] text-gray-500 font-black tracking-widest">© 1996–2026, GearHuntAccessories.com, Inc. or its affiliates</p>
      </footer>
    </main>
  );
}