import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminConsole from '@/components/admin-console'

export const metadata = { title: 'BBBT Admin Control Room', description: 'Secure BBBT operations, rider analytics, and management console.' }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/rider-login?next=/admin')
  const isAllowedAdmin = user.email?.toLowerCase() === 'brandbikebrotherhoodtrust@gmail.com'
  if (!isAllowedAdmin) redirect('/dashboard')
  const { data: admin } = await supabase.from('admin_users').select('role').eq('user_id', user.id).maybeSingle()
  const role = admin?.role ?? 'admin'
  const [{ data: riders }, { data: bikes }, { data: audit }, { data: locations }, { data: settings }, { data: statuses }] = await Promise.all([
    supabase.from('rider_profiles').select('id,display_name,phone,blood_group,blood_report_path,created_at,updated_at').order('created_at', { ascending: false }).limit(500),
    supabase.from('rider_bikes').select('id,rider_id,registration_number,brand,model,model_year,full_bike_photo_path,console_photo_path').limit(500),
    supabase.from('admin_audit_log').select('id,action,target_id,created_at').order('created_at', { ascending: false }).limit(50),
    supabase.from('admin_locations').select('id,zone,state,district,city,rider_count').order('rider_count', { ascending: false }).limit(1000),
    supabase.from('admin_settings').select('instagram_url,facebook_url,youtube_url,linkedin_url,website_url').eq('id', true).maybeSingle(),
    supabase.from('admin_rider_status').select('rider_id,status,notes,updated_at').limit(500),
  ])
  return <AdminConsole adminId={user.id} adminEmail={user.email ?? 'Admin'} role={role} riders={riders ?? []} bikes={bikes ?? []} audit={audit ?? []} locations={locations ?? []} settings={settings ?? null} statuses={statuses ?? []} />
}
