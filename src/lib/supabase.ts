import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create supabase client with fallback values for build time
// Only throw errors at runtime when actually using the client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
)

// For server-side operations that require elevated permissions
export const supabaseAdmin = supabaseServiceRoleKey && supabaseUrl
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null

// Helper function to check if admin client is available
export const requireSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file and ensure you have:\n' +
      '- NEXT_PUBLIC_SUPABASE_URL\n' +
      '- NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
      '- SUPABASE_SERVICE_ROLE_KEY'
    )
  }
  
  if (!supabaseServiceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for this operation. Please add it to your .env.local file.'
    )
  }
  
  if (!supabaseAdmin) {
    // Create admin client if it doesn't exist but we have the key
    return createClient(supabaseUrl, supabaseServiceRoleKey)
  }
  
  return supabaseAdmin
}
