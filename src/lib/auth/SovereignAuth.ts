import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const SovereignAuth = {
  // 1. Password Sign In
  async signInWithPassword(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
    return data;
  },

  // 2. MFA: Verify with Null Safety
  async verifyMFA(code: string) {
    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) throw factorsError;

    const totpFactor = factors.totp[0];
    if (!totpFactor) throw new Error("MFA Factor not found.");

    // Create challenge
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: totpFactor.id
    });

    // Check if challenge exists (Fixes 'possibly null' error)
    if (challengeError || !challenge) {
      throw new Error(challengeError?.message || "MFA Challenge failed.");
    }

    // Verify using challenge ID
    const { data: verify, error: verifyError } = await supabase.auth.mfa.verify({
      factorId: totpFactor.id,
      challengeId: challenge.id,
      code,
    });
    
    if (verifyError) throw verifyError;
    return verify;
  },

  // 3. Get Redirect Path
  async getRedirectPath(userId: string) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    return profile?.role === 'SuperAdmin' ? '/SuperAdmin' : '/UserLogin';
  },

  // 4. Logout
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = '/';
  }
};