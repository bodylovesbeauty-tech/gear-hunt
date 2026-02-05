import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 1. GLOBAL LEDGER (Server Side - Supabase)
export const ChitraguptAI = {
  async commitNewDesign(page: string, layout: object, theme: object, seo: object) {
    const { error } = await supabase.from('sovereign_design_system').upsert({
        page_name: page,
        layout_config: layout,
        theme_colors: theme,
        seo_meta: seo,
        last_updated_by: 'Akash AI'
    }, { onConflict: 'page_name' });
    if (error) throw new Error(error.message);
    return { success: true, msg: "Design Synchronized." };
  },

  async recordWorldIntel(category: string, title: string, content: string, seo: string) {
    const { error } = await supabase.from('sovereign_blogs').insert([
        { category, title, content, seo_keywords: seo, status: 'Secured' }
    ]);
    if (error) throw new Error(error.message);
    return { success: true, msg: "Intel Recorded." };
  },

  async auditFamilyChat(agent: string, action: string) {
    const { error } = await supabase.from('family_ledger').insert([
        { agent_name: agent, task_performed: action }
    ]);
    if (error) console.error("Ledger Error:", error.message);
    return { success: true };
  }
};

// 2. LOCAL LEDGER (User's Device - "WhatsApp Style" Light Weight)
export const LocalChitragupt = {
  saveLocalHistory: (agent: string, message: string) => {
    if (typeof window !== 'undefined') {
      const history = JSON.parse(localStorage.getItem('gh_local_memory') || '[]');
      history.push({ agent, message, time: new Date().toISOString() });
      if (history.length > 50) history.shift(); // Memory light rakhne ke liye
      localStorage.setItem('gh_local_memory', JSON.stringify(history));
    }
  }
};