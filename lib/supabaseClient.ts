// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types'; // ✅ fichier généré via CLI

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anon) {
  console.warn(
    '[Supabase] Variables publiques manquantes: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY',
  );
}

// ✅ Client Supabase typé avec ton schéma SQL
export const supabase = createClient<Database>(url, anon);
