import { NextResponse } from 'next/server';
import { SovereignAgents } from '../../../lib/agents/FamilyCore';
import { ChitraguptAI } from '../../../lib/agents/ChitraguptLedger';

export async function POST(req: Request) {
  try {
    const { pageName, userVibe } = await req.json();

    // 1. Akash AI generates the design logic
    const designLogic = await SovereignAgents.akash(
      `Generate a JSON design config for the ${pageName} page. 
       The user wants this vibe: ${userVibe}. 
       Include primaryColor, secondaryColor, gridColumns, and fontStyle.`
    );

    // 2. Parse the AI response (Assuming AI returns clean JSON)
    const newConfig = JSON.parse(designLogic || '{}');

    // 3. Father's Audit
    const audit = await SovereignAgents.superman(`Audit this CSS/JSON config for safety: ${designLogic}`);
    
    if (audit?.toLowerCase().includes("safe")) {
      // 4. Chitragupt commits it to the Ledger
      await ChitraguptAI.commitNewDesign(
        pageName,
        newConfig.layout || {},
        newConfig.theme || {},
        { title: `${pageName} - Sovereign Edition` }
      );

      return NextResponse.json({ success: true, msg: `Akash AI: ${pageName} has been redesigned!` });
    }

    return NextResponse.json({ success: false, msg: "Father blocked the design change." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}