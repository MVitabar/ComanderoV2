import { createBrowserClient } from '@supabase/ssr'

export function createClient(p0: string, serviceRoleKey: string, p1: { auth: { autoRefreshToken: boolean; persistSession: boolean } }) {
  return createBrowserClient(
    p0,
    serviceRoleKey,
    p1
  )
}

// Cliente compartido para toda la aplicación
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
