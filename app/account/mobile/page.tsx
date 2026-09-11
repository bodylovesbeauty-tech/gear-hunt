import { redirect } from "next/navigation"
import { MobileIdentityLink } from "@/components/mobile-identity-link"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Verify Mobile | BBBT Trust",
  description: "Link a verified mobile number to your existing BBBT account.",
  robots: { index: false, follow: false },
}

export default async function MobileAccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/account/mobile")

  return (
    <main className="auth-shell">
      <header className="auth-header">
        <span className="eyebrow">BBBT TRUST / ACCOUNT</span>
        <a className="auth-back" href="/dashboard">BACK TO DASHBOARD</a>
      </header>
      <MobileIdentityLink currentPhone={user.phone} />
    </main>
  )
}
