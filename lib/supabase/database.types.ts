export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type Identity = {
  id: string
  application_id: string | null
  full_name: string | null
  handle: string | null
  mobile: string | null
  email: string | null
  requested_role: string | null
  status: string | null
  payload: Json | null
  created_at: string | null
}
type Group = { id: string; name: string | null; share_token: string | null; description: string | null; group_size: string | null; group_handle: string | null; status: string | null; payload: Json | null; admin_id: string | null; created_at: string | null }
type GroupMembership = { id: string; group_id: string; user_id: string; role: string | null; status: string | null; joined_at: string | null; source_referral_id: string | null }
type Ride = { id: string; group_id: string | null; invite_token: string | null; creator_id: string; title: string | null; route: string | null; date_text: string | null; status: string | null; created_at: string | null; payload: Json | null }
type RideMembership = { id: string; ride_id: string; user_id: string; joined_at: string | null; source_referral_id: string | null }
type Referral = { id: string; referrer_user_id: string; public_token: string; target_type: string; target_id: string | null; status: string | null; created_at: string | null; join_at: string | null }

type Table<Row> = { Row: Row; Insert: Partial<Row> & { [key: string]: Json | undefined }; Update: Partial<Row> & { [key: string]: Json | undefined }; Relationships: [] }
type RiderProfile = { id: string; avatar_path: string | null; blood_group: string | null; blood_report_path: string | null; blood_report_date: string | null; completion_percent: number; updated_at: string };
type RiderBike = { id: string; rider_id: string; registration_number: string; brand: string | null; model: string | null; model_number: string | null; model_year: number | null; full_bike_photo_path: string | null; console_photo_path: string | null; created_at: string; updated_at: string };
type RiderEmergencyContact = { id: string; rider_id: string; contact_order: number; full_name: string; mobile: string; relationship: string; created_at: string; updated_at: string };
type ProfileRequirement = { id: string; field_key: string; field_label: string; description: string | null; role_scope: string; required_status: string; enabled_status: boolean; display_order: number; validation_rules: Json; updated_by: string | null; created_at: string; updated_at: string };
export type Database = { public: { Tables: { bbbt_identities: Table<Identity>; bbbt_groups: Table<Group>; bbbt_group_memberships: Table<GroupMembership>; bbbt_rides: Table<Ride>; bbbt_ride_memberships: Table<RideMembership>; bbbt_referrals: Table<Referral>; bbbt_profile_requirements: Table<ProfileRequirement>; rider_profiles: Table<RiderProfile>; rider_bikes: Table<RiderBike>; rider_emergency_contacts: Table<RiderEmergencyContact> }; Views: Record<string, never>; Functions: Record<string, never>; Enums: Record<string, never>; CompositeTypes: Record<string, never> } }
