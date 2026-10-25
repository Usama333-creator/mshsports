import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** null when the env vars are missing — the site then falls back to built-in demo content. */
export const supabase = url && key ? createClient(url, key) : null;
export const hasSupabase = Boolean(supabase);
export const BUCKET = "mo-media";
