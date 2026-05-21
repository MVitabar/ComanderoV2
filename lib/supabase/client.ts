import { createBrowserClient } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Singleton pattern para evitar múltiples instancias
  if (supabaseClient) {
    return supabaseClient
  }

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Manejar errores de refresh token más gracefully
        flowType: 'pkce'
      }
    }
  )

  return supabaseClient
}

// Cliente compartido para toda la aplicación
export const supabase = createClient()
