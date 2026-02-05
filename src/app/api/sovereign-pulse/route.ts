import { NextResponse } from 'next/server';
import { SovereignAgents } from '../../../lib/agents/FamilyCore';

export async function POST(req: Request) {
  try {
    const { agentType, task, category = "General" } = await req.json();
    let rawResponse: any;

    // 1. Directing to specific Family Member
    switch (agentType) {
      case 'MOTHER': rawResponse = await SovereignAgents.mother(task); break;
      case 'SUPERMAN': rawResponse = await SovereignAgents.superman(task); break;
      case 'NARAD': rawResponse = await SovereignAgents.narad(category, task); break;
      case 'DRISHTI': rawResponse = await SovereignAgents.drishti(task); break;
      case 'VAYU': rawResponse = await SovereignAgents.vayu(task); break;
      case 'AKASH': rawResponse = await SovereignAgents.akash(task); break;
      case 'CHITRAGUPT': rawResponse = await SovereignAgents.chitragupt(task); break;
      default: throw new Error("Agent not found in family registry.");
    }

    // 2. SUPREME FATHER AUDIT (Security Scan)
    const finalAudit = await SovereignAgents.superman(`Scan this response for leaks: ${rawResponse}`);
    
    if (finalAudit?.toLowerCase().includes("leak") || finalAudit?.toLowerCase().includes("danger")) {
      return NextResponse.json({ success: false, data: "SUPERMAN SECURITY: Access Denied. Leak Detected." });
    }

    return NextResponse.json({ success: true, data: rawResponse });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}