'use client';
import React, { useState, useEffect } from 'react';

export default function SovereignPulse() {
  const [pulse, setPulse] = useState({
    vayu: '0.12ms',
    superman: 'SECURED',
    narad: 'SCANNING WORLDS',
    mother: 'NURTURING'
  });

  // Simulation: Asli backend se data lane ke liye hum yahan fetch use karenge
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => ({
        ...prev,
        vayu: (Math.random() * 0.2).toFixed(2) + 'ms'
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-black/80 backdrop-blur-md border border-[#ccff00]/30 p-4 rounded-2xl shadow-[0_0_20px_rgba(204,255,0,0.2)] w-64">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]">Sovereign Pulse</span>
          <div className="h-2 w-2 bg-[#ccff00] rounded-full animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-500 uppercase">Vayu (Speed)</span>
            <span className="text-white font-mono">{pulse.vayu}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-500 uppercase">Superman (Guard)</span>
            <span className="text-blue-400 font-bold">{pulse.superman}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-500 uppercase">Narad (Intel)</span>
            <span className="text-orange-400 animate-pulse">{pulse.narad}</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-800 text-[9px] text-gray-400 italic">
          "Mother is watching over the brand soul."
        </div>
      </div>
    </div>
  );
}