'use client';
import React, { useState } from 'react';

export default function FamilyWarRoom() {
  const [logs, setLogs] = useState<{agent: string, msg: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const execute = async (agent: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/sovereign-pulse', {
        method: 'POST',
        body: JSON.stringify({ agentType: agent, task: input })
      });
      const result = await res.json();
      setLogs(prev => [{ agent, msg: result.data || result.error }, ...prev]);
    } catch (e) {
      setLogs(prev => [{ agent: 'SYSTEM', msg: 'Nitro Speed Link Broken' }, ...prev]);
    }
    setLoading(false);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-black text-[#ccff00] p-6 font-mono">
      <header className="border-b border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl font-black italic">GEARHUNT SOVEREIGN WAR ROOM</h1>
        <p className="text-[10px] text-gray-500 uppercase">Llama 3.3 Nitro Mode Active</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="flex flex-col gap-2">
          {['MOTHER', 'SUPERMAN', 'NARAD', 'DRISHTI', 'VAYU', 'AKASH', 'CHITRAGUPT'].map(name => (
            <button key={name} onClick={() => execute(name)} disabled={loading}
              className="border border-gray-800 p-3 text-[10px] font-bold hover:bg-[#ccff00] hover:text-black transition-all">
              {name} PROTOCOL
            </button>
          ))}
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            className="bg-[#050505] border border-gray-800 p-3 text-xs h-32 mt-4 outline-none focus:border-[#ccff00]"
            placeholder="Enter Sovereign Command..." />
        </div>

        <div className="lg:col-span-3 bg-[#050505] border border-gray-800 p-4 h-[70vh] overflow-y-auto rounded-lg">
          {logs.map((log, i) => (
            <div key={i} className="mb-4 text-[12px] border-b border-gray-900 pb-2">
              <span className="font-black text-white uppercase">{log.agent}: </span>
              <span className="text-gray-400">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}