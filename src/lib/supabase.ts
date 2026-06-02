import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing env vars VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — ' +
    'using static config fallback. Add them in Vercel > Settings > Environment Variables.'
  )
}

// Use placeholder values so createClient never throws — all queries will simply fail
// gracefully and the app falls back to the static config data.
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key'
)
