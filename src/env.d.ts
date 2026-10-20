interface ImportMetaEnv {
  /** Supabase project URL, e.g. https://xyz.supabase.co */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase anon (public) key. Safe to ship: access is enforced by row level security. */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
