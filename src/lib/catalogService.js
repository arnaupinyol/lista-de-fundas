import { supabase } from "./supabaseClient";

// Marcas
export async function getMarcas() {
  return await supabase.from("marcas").select("id, nombre, logo").order("nombre", { ascending: true });
}

// Modelos por marca
export async function getModelosPorMarca(marcaId) {
  return await supabase.from("modelos").select("id, nombre, fundas").eq("marca_id", marcaId);
}

// Fundas por marca (no hay modelo_id en tu tabla)
export async function getFundasPorMarca(marcaId) {
  return await supabase.from("fundas").select("id, tipo_funda, variaciones").eq("marca_id", marcaId);
}
