import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export const SovereignAuth = {
  // 1. Universal Sign In (Sabke liye ek hi gate)
  async signInWithPassword(email: string, pass: string, remember: boolean) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
      options: {
        // Aapka 15-day 'Remember Me' logic yahan hai
        persistSession: remember, 
      }
    });
    if (error) throw error;
    return data;
  },

  // 2. MFA/OTP Verification (Superman's Second Shield)
  async verifyMFA(code: string) {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId: 'totp', 
      code,
    });
    if (error) throw error;
    return data;
  },

  // 3. User Role Redirect (The Traffic Controller)
  async getRedirectPath(userId: string) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    // Yahan humne har sadasya ka rasta tay kar diya hai
    switch (profile?.role) {
      case 'SuperAdmin': 
        return '/SuperAdmin'; // Aapka War Room
      case 'UserAdmin': 
        return '/UserAdmin'; // Staff Dashboard
      case 'Seller': 
        return '/SellerLogin'; // Seller ka adda
      case 'User': 
      default: 
        return '/UserLogin'; // Customer/Buyer ka personal profile/home
    }
  },

  // 4. Logout (Family se bahar jane ka rasta)
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Logout ke baad seedha home page
    window.location.href = '/';
  }
};