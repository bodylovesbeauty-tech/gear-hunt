import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const SovereignAuth = {
  // 1. Login with Password & Remember Me
  async signInWithPassword(email: string, pass: string, remember: boolean = false) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
    return data;
  },

  // 2. MFA: Pehle Challenge, Phir Verification
  async verifyMFA(code: string) {
    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) throw factorsError;

    const totpFactor = factors.totp[0];
    if (!totpFactor) throw new Error("MFA not set up. Please enroll first.");

    // Create the challenge to get the challengeId
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: totpFactor.id
    });
    if (challengeError) throw challengeError;

    // Now verify using the ID from the challenge
    const { data: verify, error: verifyError } = await supabase.auth.mfa.verify({
      factorId: totpFactor.id,
      challengeId: challenge.id,
      code: code,
    });
    
    if (verifyError) throw verifyError;
    return verify;
  },

  // 3. Traffic Controller (Role-based redirect)
  async getRedirectPath(userId: string) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) return '/UserLogin';

    switch (profile?.role) {
      case 'SuperAdmin': return '/SuperAdmin';
      case 'UserAdmin': return '/UserAdmin';
      case 'Seller': return '/SellerDashboard';
      default: return '/UserLogin';
    }
  },

  // 4. Clean Logout
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Logout ke baad seedha sign-in page par bhej rahe hain
    window.location.href = '/auth/signin';
  }
};