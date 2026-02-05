/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
// Path fix for build stability - using relative path
import { SovereignAuth } from '../../../lib/auth/SovereignAuth';

// Superman's Local Eye for Session Management
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GearHuntSovereignSignIn() {
  const router = useRouter();
  const [authInput, setAuthInput] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState(1); 
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuthLogic = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (step === 1) {
        // Step 1: Username/Email check logic
        setStep(2);
      } else if (step === 2) {
        // Step 2: Password Check using Sovereign Engine
        const { user } = await SovereignAuth.signInWithPassword(authInput, password, rememberMe);
        if (user) {
          setStep(3);
        }
      } else if (step === 3) {
        // Step 3: MFA / OTP Verification
        await SovereignAuth.verifyMFA(otpCode);
        
        // Final: Fetch role and redirect
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Session lost. Please try again.");

        const path = await SovereignAuth.getRedirectPath(user.id);
        router.push(path);
      }
    } catch (err: any) {
      setError(err.message || 'Access Denied. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans text-black flex flex-col items-center pt-8 pb-20 px-4">
      {/* Brand Header */}
      <Link href="/" className="text-3xl font-black italic uppercase mb-6 tracking-tighter">
        Gear<span className="text-yellow-500">Hunt.</span><span className="text-xs lowercase text-gray-500 font-bold">.in</span>
      </Link>

      <div className="w-87.5 p-6 border border-gray-300 rounded-md shadow-sm">
        <h1 className="text-2xl font-bold mb-4 tracking-tight">
          {step === 1 ? 'Sign in' : step === 2 ? 'Security' : 'Verification'}
        </h1>
        
        {error && <p className="text-red-600 text-[10px] font-black mb-4 uppercase italic">⚠ {error}</p>}

        <form className="space-y-4" onSubmit={handleAuthLogic}>
          {step === 1 && (
            <div>
              <label className="block text-xs font-black mb-1 text-gray-700">Email or mobile phone number</label>
              <input 
                type="text" value={authInput} onChange={(e) => setAuthInput(e.target.value)}
                className="w-full border border-gray-400 p-2 rounded-sm text-sm focus:border-orange-500 outline-none shadow-inner"
                placeholder="Enter email or mobile number" required
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-xs font-black mb-1 text-gray-700">Password</label>
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-400 p-2 rounded-sm text-sm focus:border-orange-500 outline-none shadow-inner"
                placeholder="Password" required
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="block text-xs font-black mb-1 text-gray-700">Enter OTP / Authenticator Code</label>
              <input 
                type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                className="w-full border-2 border-dashed border-gray-400 p-2 rounded-sm text-center text-lg font-black tracking-widest outline-none focus:border-yellow-500"
                placeholder="000000" maxLength={6} required
              />
            </div>
          )}

          {step < 3 && (
            <div className="flex items-center gap-2 py-1">
              <input 
                type="checkbox" id="remember" checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3 h-3 accent-yellow-500"
              />
              <label htmlFor="remember" className="text-[11px] text-gray-700 cursor-pointer select-none">
                Keep me signed in for 15 days
              </label>
            </div>
          )}

          <button 
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-300' : 'bg-linear-to-b from-yellow-300 to-yellow-500 active:from-yellow-400 active:to-yellow-600'} py-2 rounded-md font-black text-xs shadow-md border border-gray-400 transition-all`}
          >
            {loading ? 'Processing...' : step === 1 ? 'Continue' : step === 2 ? 'Verify' : 'Sign In'}
          </button>
        </form>
      </div>

      <footer className="mt-10 text-center">
        <p className="text-[9px] text-gray-500 font-black tracking-widest uppercase italic">The Sovereign GearHunt Platform © 2026</p>
      </footer>
    </main>
  );
}