'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

const SovereignContext = createContext<any>(null);

export function SovereignThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState({
    bg: '#000000',
    primary: '#ccff00',
    text: '#ffffff',
    font: 'font-mono'
  });

  const refreshTheme = async () => {
    try {
      // Chitragupt se latest design mangna
      const res = await fetch('/api/get-sovereign-design?page=Global');
      const data = await res.json();
      if (data.success && data.design) {
        setTheme({
          bg: data.design.theme_colors.bg,
          primary: data.design.theme_colors.primary,
          text: data.design.theme_colors.text,
          font: data.design.layout_config.fontFamily || 'font-mono'
        });
      }
    } catch (e) {
      console.log("Vayu: Latency issue or no design found, staying on default.");
    }
  };

  useEffect(() => {
    refreshTheme();
    // Vayu AI says: Keep checking for design updates every 30 seconds
    const interval = setInterval(refreshTheme, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SovereignContext.Provider value={theme}>
      <div 
        style={{ '--bg-color': theme.bg, '--primary-color': theme.primary, '--text-color': theme.text } as any}
        className={`${theme.font} transition-colors duration-1000`}
      >
        {children}
      </div>
    </SovereignContext.Provider>
  );
}