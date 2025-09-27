import { supabase } from "../lib/supabaseClient";

export async function fetchCatalog() {
  console.log("🚀 Cargando catálogo desde Supabase...");

  const { data, error } = await supabase
    .from("marcas")
    .select(`
      id,
      nombre,
      logo,
      modelos (
        id,
        nombre
      ),
      fundas (
        id,
        tipo_funda,
        variaciones
      )
    `);

  console.log("🟢 DATA:", data);
  console.log("🔴 ERROR:", error);

  if (error) {
    console.error("❌ Error cargando catálogo:", error);
    return [];
  }

  // Transformamos los datos para que tu app los entienda
  const catalog = data.map((marca) => ({
    id: marca.id,
    marca: marca.nombre,
    logo: marca.logo,
    modelos: marca.modelos.map((m) => ({
      id: m.id,
      nombre: m.nombre,
    })),
    fundas: marca.fundas.map((f) => ({
      id: f.id,
      tipo: f.tipo_funda,
      variaciones: f.variaciones || [],
    })),
  }));

  return catalog;
}
