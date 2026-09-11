import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

let adminClient: SupabaseClient<Database> | null = null

export function createAdminClient() {
  if (!adminClient) {
    adminClient = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { autoRefreshToken: false, persistSession: false } })
  }
  return adminClient
}
