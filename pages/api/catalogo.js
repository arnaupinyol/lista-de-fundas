// pages/api/catalogo.js
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  try {
    const { data: marcas, error: marcasError } = await supabase
      .from("marcas")
      .select("id, nombre, logo");

    if (marcasError) throw marcasError;

    const resultado = [];

    for (const marca of marcas) {
      // Modelos
      const { data: modelos } = await supabase
        .from("modelos")
        .select("id, nombre")
        .eq("marca_id", marca.id);

      // Fundas
      const { data: fundas } = await supabase
        .from("fundas")
        .select("id, tipo_funda, variaciones")
        .eq("marca_id", marca.id);

      resultado.push({
        id: marca.id,
        marca: marca.nombre,    // Mantengo "marca" para no romper el front
        logo: marca.logo,
        modelos: modelos || [],
        fundas: fundas || []
      });
    }

    return res.status(200).json(resultado);
  } catch (err) {
    console.error("Error en /api/catalogo:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
