import { SovereignAgents } from './FamilyCore';
import { ChitraguptAI, LocalChitragupt } from './ChitraguptLedger';

export const SovereignController = {
  async executeCommand(command: string, userContext: any) {
    console.log(`[SOVEREIGN ENGINE] Processing: ${command}`);

    // 1. SUPERMAN (Father) - Har command ka Security Audit
    const security = await SovereignAgents.superman(`Scan intent: ${command}`);
    if (!security?.toLowerCase().includes("safe")) return "FATHER: Command Blocked.";

    // 2. MOTHER - Command ki "Vibe" aur "Sentiment" samajhti hai
    const decision = await SovereignAgents.mother(`Who should handle: "${command}"?`);

    let result;
    // 3. Routing to all 7 Agents based on Mother's decision
    if (decision?.includes("Narad")) {
      result = await SovereignAgents.narad("Market News", command);
    } 
    else if (decision?.includes("Akash")) {
      result = await SovereignAgents.akash(command); // UI/Design Changes
    } 
    else if (decision?.includes("Drishti")) {
      result = await SovereignAgents.drishti(command); // SEO & Strategy
    } 
    else if (decision?.includes("Vayu")) {
      result = await SovereignAgents.vayu(command); // Speed & Latency optimization
    } 
    else {
      result = "Sovereign Family: Task synchronized across all agents.";
    }

    // 4. CHITRAGUPT (Clerk) - Global & Local Memory (Light-weight model)
    // Ye server ka bojh kam rakhega aur user ke device ki memory use karega
    await ChitraguptAI.auditFamilyChat(decision || 'SYSTEM', command);
    LocalChitragupt.saveLocalHistory(decision || 'SYSTEM', result || '');

    return result;
  }
};