import { SovereignAgents } from './FamilyCore';
import { SovereignController } from './SovereignController';
import fs from 'fs';
import path from 'path';

export const MotherBirthProtocol = {
  async initiateBirth(niche: string) {
    console.log(`[MOTHER] Proposing a new specialist for: ${niche}`);

    // 1. PANCHAYAT: Saari family se charcha
    const familyMeeting = await SovereignAgents.mother(
      `Ask the family: Do we really need a ${niche} specialist? Narad, Drishti, Akash - what say you?`
    );
    console.log(`[MEETING ROOM]: ${familyMeeting}`);

    // 2. DESIGN CREATION: Mother code taiyaar karti hai
    const draftCode = await SovereignAgents.mother(
      `Create the full TypeScript code for the ${niche} agent. This is just a draft for Father's approval.`
    );

    // 3. THE FINAL BOSS: Father (Superman) checks everything
    console.log("[SUPERMAN] Auditing the new agent's design and code...");
    const fatherApproval = await SovereignAgents.superman(
      `Father, review this new agent proposal and code for ${niche}: ${draftCode}. Give FINAL_APPROVAL or REJECT.`
    );

    if (fatherApproval?.includes("FINAL_APPROVAL")) {
      // 4. PHYSICAL BIRTH: Sirf Father ki permission ke baad
      const fileName = `${niche.replace(/\s+/g, '')}Specialist.ts`;
      const filePath = path.join(process.cwd(), 'src/lib/agents/generated', fileName);

      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      fs.writeFileSync(filePath, draftCode || '');
      console.log(`[MOTHER] Father approved! The ${niche} specialist is born.`);
      return { success: true, agent: fileName };
    } else {
      console.log("[SUPERMAN] Birth REJECTED. Security or Design flaws found.");
      return { success: false, reason: "Father's Rejection" };
    }
  }
};