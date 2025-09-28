import { supabase } from "./supabaseClient";

// 📥 Obtener modelos por marca
export async function getModelosPorMarca(marcaId) {
  return await supabase
    .from("modelos")
    .select("id, nombre")
    .eq("marca_id", marcaId);
}

// 📥 Obtener fundas por modelo
export async function getFundasPorModelo(modeloId) {
  return await supabase
    .from("fundas")
    .select("id, tipo, estilo")
    .eq("modelo_id", modeloId);
}

// ➕ Añadir modelo
export async function addModelo(nombre, marca_id) {
  return await supabase.from("modelos").insert([{ nombre, marca_id }]);
}

// ➕ Añadir funda
export async function addFunda(tipo, estilo, modelo_id) {
  return await supabase.from("fundas").insert([{ tipo, estilo, modelo_id }]);
}

// ❌ Eliminar modelo
export async function deleteModelo(id) {
  return await supabase.from("modelos").delete().eq("id", id);
}

// ❌ Eliminar funda
export async function deleteFunda(id) {
  return await supabase.from("fundas").delete().eq("id", id);
}
