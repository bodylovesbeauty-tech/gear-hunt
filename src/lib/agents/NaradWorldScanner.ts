import { SovereignAgents } from './FamilyCore';
import { ChitraguptAI } from './ChitraguptLedger';

export const NaradWorldScanner = {
  async autoUpdateWorld(category: string, userVibe: string) {
    console.log(`[NARAD] Scanning the world for ${category} with vibe: ${userVibe}`);

    // 1. Fetch Real-World Data (Llama 3.3 Nitro)
    const rawIntel = await SovereignAgents.narad(category, `Find latest news/products for ${category}. User says: ${userVibe}`);

    // 2. SEO Optimization (Drishti)
    const seoContent = await SovereignAgents.drishti(rawIntel || '');

    // 3. Father's Audit (Security)
    const isSafe = await SovereignAgents.superman(rawIntel || '');

    if (isSafe?.toLowerCase().includes("safe")) {
      // 4. Chitragupt records and PUBLISHES
      await ChitraguptAI.recordWorldIntel(
        category, 
        `${category} Daily Pulse`, 
        rawIntel || '', 
        seoContent || ''
      );
      
      return { success: true, msg: `Narad: ${category} World is now updated and live!` };
    } else {
      return { success: false, msg: "Father (Superman) blocked the update. Security risk." };
    }
  }
};