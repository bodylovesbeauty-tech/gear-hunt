import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { normHandle } from "@/lib/prototype-session"

const roleMap: Record<string, string> = {
  rider: "Rider",
  "group-admin": "Group Admin",
  "group-marshal": "Group Marshal",
  "independent-marshal": "Independent Marshal",
  investor: "Investor",
  "founding-rider-council": "Founding Rider Council Member",
}

export async function PublicRoleProfile({
  roleSlug,
  handle,
}: {
  roleSlug: string
  handle: string
}) {
  const requestedRole = roleMap[roleSlug]
  const normalizedHandle = normHandle(handle)
  if (!requestedRole || !normalizedHandle || normalizedHandle.length > 32) notFound()

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("bbbt_identities")
    .select("full_name,handle,requested_role,status")
    .ilike("handle", normalizedHandle)
    .eq("requested_role", requestedRole)
    .eq("status", "Approved")
    .maybeSingle()

  if (error || !data || !data.handle) notFound()
  const publicHandle = normHandle(data.handle)

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">BBBT / PUBLIC PROFILE</p>
        <section className="border border-border bg-card p-8 shadow-sm">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{data.requested_role}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{data.full_name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">@{publicHandle}</p>
          <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Status</p>
              <p className="mt-1 font-medium">Approved BBBT member</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Profile visibility</p>
              <p className="mt-1 font-medium">Public role profile</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
