// src/lib/catalogService.js
import { supabase } from "./supabaseClient";

const limpiarLista = (values = []) => {
  if (!Array.isArray(values)) return [];

  const vistos = new Set();
  const resultado = [];

  for (const value of values) {
    const nombre = String(value ?? "").trim();
    if (!nombre || vistos.has(nombre)) continue;

    vistos.add(nombre);
    resultado.push(nombre);
  }

  return resultado;
};

const normalizarArrayEnData = (response, key) => ({
  ...response,
  data: response.data?.map((item) => ({
    ...item,
    [key]: Array.isArray(item[key]) ? item[key] : [],
  })),
});

const errorResponse = (error) => ({ data: null, error });

const createServiceError = (message) => ({
  message,
  code: "CATALOG_SERVICE_ERROR",
});

const MARCAS_FALLBACK = {
  4: { id: 4, nombre: "Apple", logo: "/apple.png" },
  5: { id: 5, nombre: "Samsung", logo: "/samsung.png" },
  6: { id: 6, nombre: "Xiaomi", logo: "/xiaomi.png" },
};

// =============================
// MARCAS
// =============================

// Obtener todas las marcas
export async function getMarcas() {
  const response = await supabase
    .from("marcas")
    .select("id, nombre, logo")
    .order("nombre", { ascending: true });

  if (response.error || response.data?.length > 0) {
    return response;
  }

  const modelosResponse = await supabase
    .from("modelos_con_fundas")
    .select("marca_id")
    .order("marca_id", { ascending: true });

  if (modelosResponse.error) return modelosResponse;

  const marcaIds = [...new Set((modelosResponse.data || []).map((row) => row.marca_id))];
  const marcas = marcaIds
    .map((id) => MARCAS_FALLBACK[id])
    .filter(Boolean)
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  return {
    ...response,
    data: marcas,
    error: null,
  };
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
// MODELOS
// =============================

// Obtener modelos por marca
export async function getModelosPorMarca(marcaId) {
  const response = await supabase
    .from("modelos_con_fundas")
    .select("id, marca_id, nombre, fundas")
    .eq("marca_id", marcaId)
    .order("id", { ascending: true });

  return normalizarArrayEnData(response, "fundas");
}

// Añadir un modelo
export async function addModelo(nombre, marca_id, fundasSeleccionadas = []) {
  const fundas = limpiarLista(fundasSeleccionadas);
  let relacionesFundas = [];

  if (fundas.length > 0) {
    const fundasResponse = await supabase
      .from("fundas_con_variaciones")
      .select("id, tipo_funda")
      .eq("marca_id", marca_id)
      .in("tipo_funda", fundas);

    if (fundasResponse.error) return errorResponse(fundasResponse.error);

    const fundaIdPorTipo = new Map(
      (fundasResponse.data || []).map((funda) => [funda.tipo_funda, funda.id])
    );

    const fundasSinId = fundas.filter((tipoFunda) => !fundaIdPorTipo.has(tipoFunda));

    if (fundasSinId.length > 0) {
      return errorResponse(
        createServiceError(
          `No se han encontrado fundas para: ${fundasSinId.join(", ")}`
        )
      );
    }

    relacionesFundas = fundas.map((tipoFunda, index) => ({
      funda_id: fundaIdPorTipo.get(tipoFunda),
      orden: index + 1,
    }));
  }

  const modeloResponse = await supabase
    .from("modelos")
    .insert([{ nombre, marca_id }])
    .select("id, marca_id, nombre")
    .single();

  if (modeloResponse.error) return errorResponse(modeloResponse.error);

  const modelo = modeloResponse.data;

  if (relacionesFundas.length > 0) {
    const relaciones = relacionesFundas.map((relacion) => ({
      modelo_id: modelo.id,
      ...relacion,
    }));

    const relacionesResponse = await supabase
      .from("modelo_fundas")
      .insert(relaciones);

    if (relacionesResponse.error) return errorResponse(relacionesResponse.error);
  }

  return {
    data: [{ ...modelo, fundas }],
    error: null,
  };
}

// Eliminar un modelo
export async function deleteModelo(id) {
  return await supabase.from("modelos").delete().eq("id", id);
}

// =============================
// FUNDAS
// =============================

// Obtener fundas por marca
export async function getFundasPorMarca(marcaId) {
  const response = await supabase
    .from("fundas_con_variaciones")
    .select("id, marca_id, tipo_funda, variaciones")
    .eq("marca_id", marcaId)
    .order("id", { ascending: true });

  return normalizarArrayEnData(response, "variaciones");
}

// Obtener colores disponibles para seleccionar en nuevas fundas
export async function getColoresDisponibles() {
  const coloresResponse = await supabase
    .from("colores")
    .select("nombre")
    .order("nombre", { ascending: true });

  if (coloresResponse.error) return coloresResponse;

  const colores = limpiarLista((coloresResponse.data || []).map((color) => color.nombre));

  if (colores.length > 0) {
    return { ...coloresResponse, data: colores, error: null };
  }

  const fundasResponse = await supabase
    .from("fundas_con_variaciones")
    .select("variaciones");

  if (fundasResponse.error) return fundasResponse;

  const coloresDesdeVista = limpiarLista(
    (fundasResponse.data || []).flatMap((funda) => funda.variaciones || [])
  ).sort((a, b) => a.localeCompare(b));

  return {
    ...fundasResponse,
    data: coloresDesdeVista,
    error: null,
  };
}

// Añadir funda
export async function addFunda(marca_id, tipo_funda, variaciones = []) {
  const coloresLimpios = limpiarLista(variaciones);

  const fundaResponse = await supabase
    .from("fundas")
    .insert([{ marca_id, tipo_funda }])
    .select("id, marca_id, tipo_funda")
    .single();

  if (fundaResponse.error) return errorResponse(fundaResponse.error);

  const funda = fundaResponse.data;

  if (coloresLimpios.length > 0) {
    const coloresResponse = await supabase
      .from("colores")
      .upsert(
        coloresLimpios.map((nombre) => ({ nombre })),
        { onConflict: "nombre" }
      )
      .select("id, nombre");

    if (coloresResponse.error) return errorResponse(coloresResponse.error);

    const colorIdPorNombre = new Map(
      (coloresResponse.data || []).map((color) => [
        color.nombre,
        color.id,
      ])
    );

    const coloresNoDevueltos = coloresLimpios.filter(
      (nombre) => !colorIdPorNombre.has(nombre)
    );

    if (coloresNoDevueltos.length > 0) {
      const coloresIdsResponse = await supabase
        .from("colores")
        .select("id, nombre")
        .in("nombre", coloresNoDevueltos);

      if (coloresIdsResponse.error) {
        return errorResponse(coloresIdsResponse.error);
      }

      for (const color of coloresIdsResponse.data || []) {
        colorIdPorNombre.set(color.nombre, color.id);
      }
    }

    const coloresSinId = coloresLimpios.filter(
      (nombre) => !colorIdPorNombre.has(nombre)
    );

    if (coloresSinId.length > 0) {
      return errorResponse(
        createServiceError(
          `No se han podido resolver colores: ${coloresSinId.join(", ")}`
        )
      );
    }

    const relaciones = coloresLimpios.map((nombre, index) => ({
      funda_id: funda.id,
      color_id: colorIdPorNombre.get(nombre),
      orden: index + 1,
    }));

    const relacionesResponse = await supabase
      .from("funda_colores")
      .insert(relaciones);

    if (relacionesResponse.error) return errorResponse(relacionesResponse.error);
  }

  return {
    data: [{ ...funda, variaciones: coloresLimpios }],
    error: null,
  };
}

// Eliminar funda
export async function deleteFunda(id) {
  return await supabase.from("fundas").delete().eq("id", id);
}
