import { redirect } from "next/navigation";
import { RoleDashboard } from "@/components/role-dashboard";
import { createClient } from "@/lib/supabase/server";
import type { PrototypeIdentity, Role, Status, DemoUser } from "@/lib/prototype-session";

const dashboardForRole: Partial<Record<Role, string>> = {
  Rider: "/rider-dashboard",
  "Group Admin": "/group-admin-dashboard",
  "Group Marshal": "/group-marshal-dashboard",
  "Independent Marshal": "/independent-marshal-dashboard",
  Investor: "/investor-dashboard",
  "Founding Rider Council Member": "/founding-rider-council-dashboard",
};

export async function ServerRoleDashboard({ role }: { role: Role }) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect(`/login?returnTo=${encodeURIComponent(dashboardForRole[role] ?? "/dashboard")}`);

  const identityQuery = authUser.email
    ? supabase.from("bbbt_identities").select("id, full_name, handle, mobile, email, address, city, pin_code, blood_group, blood_report, profile_photo, emergency_name, emergency_number, requested_role, status, application_id, created_at").ilike("email", authUser.email).maybeSingle()
    : supabase.from("bbbt_identities").select("id, full_name, handle, mobile, email, address, city, pin_code, blood_group, blood_report, profile_photo, emergency_name, emergency_number, requested_role, status, application_id, created_at").eq("mobile", authUser.phone ?? "").maybeSingle();
  const { data: row } = await identityQuery;
  const status = (row?.status ?? "Pending") as Status;
  const resolvedRole = (row?.requested_role ?? "") as Role;
  if (!row || status !== "Approved" || resolvedRole !== role) {
    redirect(dashboardForRole[resolvedRole] ?? "/login");
  }

  const identity = {
    id: row.id,
    applicationId: row.application_id,
    fullName: row.full_name,
    handle: row.handle,
    mobile: row.mobile,
    email: row.email,
    address: row.address,
    city: row.city,
    pinCode: row.pin_code,
    bloodGroup: row.blood_group,
    bloodReport: row.blood_report,
    profilePhoto: row.profile_photo,
    emergencyName: row.emergency_name,
    emergencyNumber: row.emergency_number,
    requestedRole: row.requested_role,
    status,
    createdAt: row.created_at,
  } as PrototypeIdentity;
  const dashboardUser: DemoUser = {
    id: authUser.id,
    name: identity.fullName,
    handle: identity.handle,
    primaryRole: role,
    approvedRoles: [role],
    status,
    referral: `BBBT.in/join/${identity.handle.replace(/^@/, "")}`,
  };
  return <RoleDashboard role={role} initialUser={dashboardUser} initialIdentity={identity} />;
}

export const roleDashboardPaths = dashboardForRole;

export function roleDashboardPath(role: Role) {
  return dashboardForRole[role] ?? "/dashboard";
}
