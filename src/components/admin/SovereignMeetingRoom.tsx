'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SovereignMeetingRoom() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'family_ledger' }, 
      (payload) => {
        setLogs((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="bg-[#050505] border border-gray-800 rounded-xl overflow-hidden font-mono shadow-2xl">
      <div className="bg-gray-900/50 p-3 border-b border-gray-800 flex justify-between items-center">
        <span className="text-[10px] text-[#ccff00] font-black uppercase tracking-tighter">
          Internal Family Meeting (Live)
        </span>
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          <div className="h-2 w-2 rounded-full bg-green-500" />
        </div>
      </div>
      
      {/* Fix: Standard height class used */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 text-[12px]">
        {logs.map((log, i) => (
          <div key={i} className="border-l-2 border-gray-800 pl-3 py-1">
            <span className={`font-black uppercase ${
              log.agent_name === 'SUPERMAN' ? 'text-blue-400' : 
              log.agent_name === 'MOTHER' ? 'text-pink-400' : 'text-[#ccff00]'
            }`}>
              {log.agent_name}:
            </span>
            <p className="text-gray-400 mt-1">{log.task_performed}</p>
            <span className="text-[9px] text-gray-600 italic">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {/* Fix: Removed duplicate 'italic' class */}
        {logs.length === 0 && <p className="text-gray-600 text-center mt-20 italic">Waiting for agents to speak...</p>}
      </div>
    </div>
  );
}