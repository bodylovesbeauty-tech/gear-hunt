'use client';
import React, { useState } from 'react';
// Fix: Relative path updated so the War Room can find the Engine
import { SovereignController } from '../../lib/agents/SovereignController'; 

export default function SovereignCommandCenter() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Agents are Idle...');

  const handleCommand = async () => {
    if (!input.trim()) return;
    
    setStatus('Family Meeting in progress...');
    try {
      const response = await SovereignController.executeCommand(input, { user: 'Bete' });
      setStatus(response || 'Task synchronized across the family.');
      setInput('');
    } catch (error) {
      setStatus('Vayu: Connection lag! Try again.');
    }
  };

  return (
    <div className="p-6 bg-[#0a0a0a] rounded-3xl border border-[#ccff00]/20 shadow-2xl">
      <h2 className="text-[#ccff00] font-black mb-4 uppercase italic tracking-widest">Sovereign War Room</h2>
      
      <div className="space-y-4">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Bhai Narad, market scan karo aur Akash ko bolo design badle..."
          className="w-full bg-black border border-gray-800 p-4 rounded-xl text-white focus:border-[#ccff00] outline-none transition-all"
          onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
        />
        
        <button 
          onClick={handleCommand}
          className="w-full bg-[#ccff00] text-black font-black py-4 rounded-xl hover:bg-[#b3e600] active:scale-95 transition-all uppercase"
        >
          Execute Protocol
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-[#ccff00] animate-pulse" />
          <span className="text-[10px] text-gray-500 uppercase font-bold">Live Intelligence</span>
        </div>
        <p className="text-sm text-gray-300 italic">
          <span className="text-[#ccff00]">Response:</span> {status}
        </p>
      </div>
    </div>
  );
}