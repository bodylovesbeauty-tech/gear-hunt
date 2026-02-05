'use client'; 
import React, { useState } from 'react';

export default function IndiaGearTrends() {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const regionalGearIntelligence: { [key: string]: string } = {
    'Delhi': 'High-Performance Air Filters & Anti-Pollution Masks',
    'Maharashtra': 'Touring Panniers & Rain Gear (Western Ghats Special)',
    'Karnataka': 'Ventilated Riding Jackets & City Mesh Gloves',
    'Uttar Pradesh': 'Rugged Crash Guards & Long-Haul Seats',
    'Rajasthan': 'Dust-Proof Air Filters & Desert Riding Goggles'
  };

  const executeTrendAnalysis = (region: string) => {
    if (!region) return;
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 850);
  };

  const onRegionChange = (region: string) => {
    setSelectedRegion(region);
    executeTrendAnalysis(region);
  };

  // Simple SVG Icons to replace Lucide and kill all errors
  const Icons = {
    MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
    ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
    Zap: ({ size = 24, fill = "none" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 L3 14 L12 14 L11 22 L21 10 L12 10 L13 2 Z"/></svg>,
    Refresh: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>,
    Loader: () => <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
  };

  return (
    <section className="max-w-4xl mx-auto my-10 p-1 bg-linear-to-r from-[#ccff00] to-transparent rounded-2xl font-sans shadow-2xl">
      <div className="bg-[#0a0a0a] p-8 rounded-[14px] border border-gray-900 text-white">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ccff00] rounded-lg shadow-[0_0_15px_rgba(204,255,0,0.4)]">
              <Icons.MapPin />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                Sovereign <span className="text-[#ccff00]">Gear Trends</span>
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[3px]">Pan-India Node Active</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative min-w-55">
              <select
                className="w-full p-4 bg-black border-2 border-gray-800 text-[#ccff00] rounded-xl appearance-none focus:outline-none focus:border-[#ccff00] transition-all cursor-pointer font-black italic text-sm uppercase tracking-widest"
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value)}
              >
                <option value="">-- SELECT REGION --</option>
                {Object.keys(regionalGearIntelligence).map((region) => (
                  <option key={region} value={region} className="bg-black text-white">{region.toUpperCase()}</option>
                ))}
              </select>
              <div className="absolute right-4 top-4 text-[#ccff00] pointer-events-none">
                <Icons.ChevronDown />
              </div>
            </div>

            {selectedRegion && (
              <button 
                onClick={() => executeTrendAnalysis(selectedRegion)}
                className="p-4 bg-gray-900 border-2 border-gray-800 text-[#ccff00] rounded-xl hover:border-[#ccff00] transition-all"
              >
                <Icons.Refresh className={isAnalyzing ? "animate-spin" : ""} />
              </button>
            )}
          </div>
        </div>

        <div className="min-h-35 flex items-center justify-center bg-black/50 rounded-xl border border-dashed border-gray-800 p-4 text-center">
          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-3 text-[#ccff00]">
              <Icons.Loader />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Analyzing dynamics...</p>
            </div>
          ) : selectedRegion ? (
            <div className="w-full relative group p-6 border border-[#ccff00]/20 rounded-xl bg-linear-to-br from-black to-gray-900 overflow-hidden">
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex p-4 bg-[#ccff00]/10 rounded-full border border-[#ccff00]/30 text-[#ccff00]">
                  <Icons.Zap size={32} fill="#ccff00" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-[#ccff00] font-black text-xs uppercase tracking-[0.2em] mb-2 opacity-80">
                    Sovereign Recommendation for {selectedRegion}:
                  </p>
                  <h3 className="text-white font-extrabold text-xl md:text-3xl italic tracking-tight uppercase leading-tight">
                    {regionalGearIntelligence[selectedRegion]}
                  </h3>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-30">
              <Icons.Zap size={40} />
              <p className="text-gray-500 font-bold italic uppercase tracking-widest text-xs">
                Awaiting Intelligence Injection
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}