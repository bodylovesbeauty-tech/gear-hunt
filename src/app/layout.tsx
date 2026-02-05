import { SovereignThemeProvider } from '../components/SovereignThemeProvider'; // Path fix kiya
import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // Type fix kiya (Error 7031)
}) {
  return (
    <html lang="en">
      <body>
        <SovereignThemeProvider>
          {children}
        </SovereignThemeProvider>
      </body>
    </html>
  );
}