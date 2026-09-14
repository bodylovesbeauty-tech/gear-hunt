import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard/soscore";
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/auth/error", request.url));

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/auth/error", request.url));

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const metadata = user.user_metadata ?? {};
    const role = metadata.requested_role;
    if (role === "Rider") {
      await supabase.from("rider_profiles").upsert({ id: user.id, blood_group: metadata.blood_group ?? null, blood_report_date: metadata.blood_report_date ?? null, completion_percent: 0, updated_at: new Date().toISOString() });
      const contacts = Array.isArray(metadata.emergency_contacts) ? metadata.emergency_contacts.slice(0, 5).filter((contact: unknown) => typeof contact === "object" && contact !== null && "full_name" in contact && "mobile" in contact && "relationship" in contact) : [];
      if (contacts.length) await supabase.from("rider_emergency_contacts").upsert(contacts.map((contact, index) => ({ rider_id: user.id, contact_order: index + 1, full_name: String(contact.full_name), mobile: String(contact.mobile), relationship: String(contact.relationship) })), { onConflict: "rider_id,contact_order" });
    }
  }

  return NextResponse.redirect(new URL(safeNext(request.nextUrl.searchParams.get("next")), request.url));
}
