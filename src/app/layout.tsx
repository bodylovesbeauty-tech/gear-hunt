/* eslint-disable */
// @ts-nocheck
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GearHuntAccessories | World's 1st AI Social Shopping for Gear Enthusiasts 🏆",
  description: "Expert-curated gear for Car, Bike, Sports, and Industry. Made by Experts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased selection:bg-yellow-500/30`}>
        {/* Step 1 Cleanse: Humne yahan se purana <Navbar /> hata diya hai taaki 
            har page ke upar purani navigation na chipki rahe. */}
        {children}
      </body>
    </html>
  );
}