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
export type Database = { public: { Tables: { bbbt_identities: Table<Identity>; bbbt_groups: Table<Group>; bbbt_group_memberships: Table<GroupMembership>; bbbt_rides: Table<Ride>; bbbt_ride_memberships: Table<RideMembership>; bbbt_referrals: Table<Referral> }; Views: Record<string, never>; Functions: Record<string, never>; Enums: Record<string, never>; CompositeTypes: Record<string, never> } }
