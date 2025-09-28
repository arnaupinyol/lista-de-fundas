// src/lib/catalogService.js
import { supabase } from "./supabaseClient";

// =============================
// 📦 MARCAS
// =============================

// Obtener todas las marcas
export async function getMarcas() {
  return await supabase.from("marcas").select("id, nombre, logo").order("nombre", { ascending: true });
}

// Añadir una marca
export async function addMarca(nombre, logo) {
  return await supabase.from("marcas").insert([{ nombre, logo }]).select();
}

// Eliminar una marca
export async function deleteMarca(id) {
  return await supabase.from("marcas").delete().eq("id", id);
}

// =============================
// 📦 MODELOS
// =============================

// Obtener modelos por marca
export async function getModelosPorMarca(marcaId) {
  return await supabase.from("modelos").select("id, nombre, fundas").eq("marca_id", marcaId);
}

// Añadir un modelo
export async function addModelo(nombre, marca_id, fundas = null) {
  return await supabase.from("modelos").insert([{ nombre, marca_id, fundas }]).select();
}

// Eliminar un modelo
export async function deleteModelo(id) {
  return await supabase.from("modelos").delete().eq("id", id);
}

// =============================
// 📦 FUNDAS
// =============================

// Obtener fundas por marca
export async function getFundasPorMarca(marcaId) {
  return await supabase.from("fundas").select("id, tipo_funda, variaciones").eq("marca_id", marcaId);
}

// Añadir funda
export async function addFunda(marca_id, tipo_funda, variaciones = []) {
  return await supabase.from("fundas").insert([{ marca_id, tipo_funda, variaciones }]).select();
}

// Eliminar funda
export async function deleteFunda(id) {
  return await supabase.from("fundas").delete().eq("id", id);
}
