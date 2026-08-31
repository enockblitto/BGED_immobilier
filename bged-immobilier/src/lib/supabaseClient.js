import { createClient } from "@supabase/supabase-js";

// Ces deux valeurs viennent du fichier .env (voir .env.example)
// et se trouvent dans Supabase : Project Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Variables Supabase manquantes. Copiez .env.example vers .env et renseignez vos clés."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
