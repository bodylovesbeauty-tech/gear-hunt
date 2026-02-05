/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { SovereignAuth } from '../../../lib/auth/SovereignAuth';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuthLogic = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (step === 1) {
        setStep(2);
      } else if (step === 2) {
        // Step 2: Sign in with Password
        const result = await SovereignAuth.signInWithPassword(authInput, password);
        // @ts-ignore
        if (result?.user) {
          setStep(3);
        }
      } else if (step === 3) {
        // Step 3: Verify MFA
        await SovereignAuth.verifyMFA(otpCode);
        
        // Final: Check user session and redirect
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const path = await SovereignAuth.getRedirectPath(user.id);
          router.push(path);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Access Denied. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans text-black flex flex-col items-center pt-10 px-4">
      <Link href="/" className="text-3xl font-black italic uppercase mb-8 tracking-tighter">
        Gear<span className="text-yellow-500">Hunt.</span>
      </Link>

      <div className="w-full max-w-sm p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-2xl font-black mb-6 uppercase italic tracking-tighter border-b-4 border-yellow-500 inline-block">
          {step === 1 ? '01: IDENTIFY' : step === 2 ? '02: AUTHORIZE' : '03: VERIFY'}
        </h1>
        
        {error && (
          <p className="bg-red-600 text-white p-2 text-[10px] font-black mb-4 uppercase italic">
            ⚠ {error}
          </p>
        )}

        <form className="space-y-6" onSubmit={handleAuthLogic}>
          {step === 1 && (
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block">Rider ID (Email/Mobile)</label>
              <input 
                type="text" value={authInput} onChange={(e) => setAuthInput(e.target.value)}
                className="w-full border-2 border-black p-3 font-bold outline-none focus:bg-yellow-50"
                placeholder="ENTER EMAIL" required
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block">Security Key (Password)</label>
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-black p-3 font-bold outline-none focus:bg-yellow-50"
                placeholder="ENTER PASSWORD" required
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block">MFA Nitro Code</label>
              <input 
                type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                className="w-full border-2 border-black p-3 text-center text-3xl font-black tracking-[0.4em] outline-none bg-black text-yellow-500"
                placeholder="000000" maxLength={6} required
              />
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-black text-white py-4 font-black uppercase italic hover:bg-yellow-500 hover:text-black transition-all border-2 border-black active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            {loading ? 'FUELING...' : 'CONTINUE >>'}
          </button>
        </form>
      </div>
    </main>
  );
}