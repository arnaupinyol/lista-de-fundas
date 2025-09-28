// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Esto aparece en la consola del navegador *solo* si la app ya se construyó sin vars
  console.error("❌ Faltan variables VITE_ en build:");
  console.error("VITE_SUPABASE_URL:", supabaseUrl);
  console.error("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ existe" : "❌ falta");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

