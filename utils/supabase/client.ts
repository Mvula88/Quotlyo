import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing")
    throw new Error("Supabase URL or Anon Key is missing")
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
